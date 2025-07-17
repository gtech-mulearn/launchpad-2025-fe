import { apiHandler } from "@/lib/axios"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"



// Interface for interest group
interface InterestGroup {
  id: string;
  name: string;
}

// Interface for karma distribution
interface KarmaDistribution {
  task_type: string;
  karma: number;
}

// Interface for eligible candidate
interface EligibleCandidate {
  id: string;
  full_name: string;
  email: string;
  muid: string;
  profile_pic: string | null;
  karma: number;
  level: string;
  college_name: string;
  interest_groups: InterestGroup[];
  roles: string[];
  rank: number;
  karma_distribution: KarmaDistribution[];
}

// Interface for API response
interface EligibleCandidatesResponse {
  hasError: boolean;
  statusCode: number;
  message: {
    general: string[];
  };
  response: {
    job_info: {
      id: string;
      title: string;
      minimum_karma: number;
      domain: string;
      interest_groups: string;
    };
    data: EligibleCandidate[];
    pagination: {
      count: number;
      totalPages: number;
      isNext: boolean;
      isPrev: boolean;
      nextPage: string | null;
    };
  };
}

type AddJobDto = {
    company: string,
    recruiter: string,
    title: string,
    skills: string,
    experience: string,
    domain: string,
    location: string,
    salary_range: string,
    job_type: string,
    minimum_karma: number,
    interest_groups: string[],
    opening_type: "General" | "Task",
}

interface ScheduleInterviewDto {
  jobId: string;
  studentId: string;
  date: string; // format: "YYYY-MM-DD"
  time: string; // format: "HH:mm"
}

interface ScheduleInterviewResponse {
  statusCode: number;
  message: string | string[];
  response: any; // Replace with actual response structure if known
}


const useAddJob = (accessToken: string) => {
    return useMutation<{}, {}, AddJobDto>({
        mutationFn: async (addJobDto) => {
            const { data } = await apiHandler.post("/launchpad/add-job/",
                addJobDto, { headers: { Authorization: `Bearer ${accessToken}` } }
            )
            return data
        },
    })
}

const useListJobOffers = (companyId: string, accessToken: string) => {
  return useQuery({
    queryKey: ["job-offers", companyId],
    queryFn: async () => {
      const { data } = await apiHandler.get(`/launchpad/list-jobs/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          company_id: companyId,
        },
      });
      return data.response.map((offer: any) => ({
        id: offer.id,
        title: offer.title,
        company_id: offer.company_id,
        salaryRange: offer.salary_range || null,
        location: offer.location || null,
        experience: offer.experience || null,
        skills: offer.skills || null,
        jobType: offer.job_type as "Full-time" | "Part-time" | "Internship" | "Contract",
        interestGroups: offer.interest_groups || "",
        minKarma: offer.minimum_karma || 0,
        task: offer.task_title ? { title: offer.task_title, description: offer.task_description || "" } : null,
        createdAt: offer.created_at,
        openingType: offer.opening_type === "General" ? "General" : "Task",
      }));
    },
    enabled: !!companyId && !!accessToken,
  });
};


 const useListEligibleCandidates = (jobId: string, accessToken: string) => {
  return useQuery<EligibleCandidatesResponse, Error>({
    queryKey: ["eligible-candidates", jobId],
    queryFn: async () => {
      if (!jobId || !accessToken) {
        throw new Error("Job ID and access token are required");
      }

      const { data } = await apiHandler.get<EligibleCandidatesResponse>(`/launchpad/list-launchpad-students/${jobId}/`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            },
        });
      if (data.hasError) {
        throw new Error(data.message?.general?.[0] || "Error fetching eligible candidates");
      }

      return data;
    },
    enabled: !!jobId && !!accessToken,
  });
};




const useSendJobInvitations = (accessToken: string) => {
    const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ jobId, studentIds }: { jobId: string; studentIds: string[] }) => {
      try {
        const response = await apiHandler.post(
          "/launchpad/send-job-invitations/",
          {
            job_id: jobId,
            student_ids: studentIds,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.data.statusCode === 200) {
          return response.data.response;
        } else {
          throw new Error(response.data.message || "Failed to send invitations");
        }
      } catch (error) {
        console.error("Error sending job invitations:", error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate relevant queries to refresh hire requests or related data
      queryClient.invalidateQueries({ queryKey: ["hire-requests"] });
    },
    onError: (error: Error) => {
      console.error("Mutation error:", error.message);
    },
  });
};


export {
    useAddJob,
    useListJobOffers,
    useSendJobInvitations,
    useListEligibleCandidates,
    
    
}





