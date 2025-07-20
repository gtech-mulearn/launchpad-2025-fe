import { apiHandler } from "@/lib/axios"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

interface AcceptedStudent {
  application_id: string;
  student_info: {
    id: string;
    full_name: string;
    email: string;
    muid: string;
    profile_pic: string;
    karma: number;
    college_name: string;
    interest_groups: Array<{ id: string; name: string }>;
  };
  job_info: {
    id: string;
    title: string;
    company_name: string;
    opening_type: string;
    domain: string;
    skills: string;
    location: string;
    salary_range: string;
  };
  application_details: {
    resume_link: string;
    linkedin_link: string;
    portfolio_link: string;
    cover_letter: string;
    other_link: string;
  };
  timeline: {
    invited_at: string;
    applied_at: string;
  };
}

interface AcceptedStudentsResponse {
  hasError: boolean;
  statusCode: number;
  message: { general: string[] };
  response: {
    data: {
      applications: AcceptedStudent[];
      statistics: {
        total_accepted_across_jobs: number;
        total_jobs: number;
        jobs_with_accepted_candidates: number;
      };
    };
    pagination: {
      count: number;
      totalPages: number;
      isNext: boolean;
      isPrev: boolean;
      nextPage: number | null;
    };
  };
}


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
  application_id: string;
  interview_date: string;
  interview_time: string;
  interview_platform: string;
  interview_link: string;
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
      return {
        jobs: data.response.jobs.map((offer: any) => ({
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
        })),
        general: data.response.summary
      }
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

export const useGetAcceptedStudents = (accessToken: string) => {
  return useQuery<AcceptedStudentsResponse, Error>({
    queryKey: ['acceptedStudents'],
    queryFn: async () => {
      const { data } = await apiHandler.get<AcceptedStudentsResponse>("/launchpad/accepted-students/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (data.hasError) {
        throw new Error(data.message?.general?.join(", ") || "Error fetching accepted students");
      }
      return data;
    },
    enabled: !!accessToken, // Only fetch if accessToken is present
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    gcTime: 1000 * 60 * 10, // Keep in cache for 10 minutes
  });
};


interface LeaderboardParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export const useGetLaunchpadLeaderboard = (params: LeaderboardParams = {}) => {
  const { page = 1, perPage = 10, search } = params;

  return useQuery({
    queryKey: ['launchpad-leaderboard', page, perPage, search],
    queryFn: async () => {
      const queryParams: Record<string, any> = {
        page,
        perPage
      };

      if (search && search.trim().length >= 3) queryParams.search = search.trim();

      const { data } = await apiHandler.get('/launchpad/leaderboard/', {
        params: queryParams
      });
      console.log("Launchpad Leaderboard Data:", data.response);
      return data.response;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    gcTime: 1000 * 60 * 10, // Keep in cache for 10 minutes
  });
}


export const useScheduleInterview = (accessToken: string) => {
  const queryClient = useQueryClient();
  return useMutation<ScheduleInterviewResponse, Error, ScheduleInterviewDto>({
    mutationFn: async (dto) => {
      const { data } = await apiHandler.post<ScheduleInterviewResponse>(
        "/launchpad/schedule-interview/",
        dto,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return data;
    },
    onSuccess: () => {
      // Invalidate accepted students query to refresh related data if needed
      queryClient.invalidateQueries({ queryKey: ['acceptedStudents'] });
    },
    onError: (error) => {
      console.error("Failed to schedule interview:", error);
    },
  });
};

// // {
//   "application_id": "d456ec7a-55a1-4c4e-b9c3-12abfa1a3456",
//   "interview_date": "2025-07-20",
//   "interview_time": "15:00:00",
//   "interview_platform": "Google Meet",
//   "interview_link": "https://meet.google.com/xyz-abcd-efg"
// }

export {
  useAddJob,
  useListJobOffers,
  useSendJobInvitations,
  useListEligibleCandidates,


}





