"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/recruiter/Header";
import { StatCard } from "@/components/recruiter/StatCard";
import { TabsNavigation } from "@/components/recruiter/TabsNavigation";
import { CandidatesTab } from "@/components/recruiter/CandidatesTab";
import { JobOffersTab } from "@/components/recruiter/JobOffersTab";
import { LeaderboardTab } from "@/components/recruiter/LeaderboardTab";
import { HireRequestsTab } from "@/components/recruiter/HireRequestsTab";
import { AnalyticsTab } from "@/components/recruiter/AnalyticsTab";
import { CreateJobOfferModal } from "@/components/recruiter/CreateJobOfferModal";
import { JobOfferDetailsModal } from "@/components/recruiter/JobOfferDetailsModal";
import { ScheduleInterviewModal } from "@/components/recruiter/ScheduleInterviewModal";
import { CandidateDetailsModal } from "@/components/recruiter/CandidateDetailsModal";
import { Users, Briefcase, Calendar, TrendingUp } from "lucide-react";
import { useLocalStorage } from "@/hooks/misc";
import { useGetRecruiter } from "@/hooks/auth";
import {
  useAddJob,
  useUpdateJob,
  useListJobOffers,
  useListEligibleCandidates,
  useHireCandidate,
  useGetLaunchpadLeaderboard,
  useGetHireRequests,
} from "@/hooks/recuiter";
import {
  JobOffer,
  JobInvite,
  Candidate,
  InterviewDetails,
  LeaderboardStudent,
} from "@/types/recruiter";
import { toast } from "sonner";
import { apiHandler } from "@/lib/axios";

// Move this hook outside the component or to a separate file
const useGetInterestGroups = (accessToken: string) => {
  const [interestGroups, setInterestGroups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInterestGroups = async () => {
      try {
        const response = await fetch(
          "https://mulearn.org/api/v1/dashboard/ig/list/",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch interest groups");
        const data = await response.json();
        if (data.hasError)
          throw new Error(data.message || "Error fetching interest groups");
        setInterestGroups(data.response.interestGroup);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setIsLoading(false);
      }
    };

    if (accessToken) fetchInterestGroups();
  }, [accessToken]);

  return { interestGroups, isLoading, error };
};

export default function RecruiterDashboard() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // All hooks must be called at the top level, before any conditional logic
  const [accessToken] = useLocalStorage("accessToken", "");
  const [userId] = useLocalStorage("userId", "");
  const [userEmail, setUserEmail] = useState("");
  const [activeTab, setActiveTab] = useState("job-offers");
  const [hireRequests, setHireRequests] = useState<JobInvite[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [selectedJobOffer, setSelectedJobOffer] = useState<JobOffer | null>(
    null
  );
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [leaderboardPage, setLeaderboardPage] = useState(1);
  const [leaderboardPerPage, setLeaderboardPerPage] = useState(10);
  const [leaderboardSearch, setLeaderboardSearch] = useState("");
  const [scheduleInviteId, setScheduleInviteId] = useState<number | null>(null);
  const [hireRequestFilter, setHireRequestFilter] = useState<string | null>(
    null
  );
  const [candidatesPage, setCandidatesPage] = useState(1);
  const [newJobOffer, setNewJobOffer] = useState<JobOffer>({
    id: "",
    title: "",
    company_id: "",
    salaryRange: null,
    location: null,
    experience: null,
    skills: null,
    jobType: null,
    interestGroups: "",
    minKarma: 0,
    task_id: null,
    task_description: null,
    task_hashtag: null,
    task_verified: null,
    createdAt: new Date().toISOString().split("T")[0],
    openingType: null,
  });

  // All custom hooks must be called before any conditional returns
  const recruiter = useGetRecruiter(userId, accessToken);
  const addJobMutation = useAddJob(accessToken);
  const updateJobMutation = useUpdateJob(accessToken);
  const {
    interestGroups,
    isLoading: isInterestGroupsLoading,
    error: interestGroupsError,
  } = useGetInterestGroups(accessToken);
  const {
    data: jobOffers,
    isLoading: isJobOffersLoading,
    error: jobOffersError,
    refetch: refetchJobOffers,
  } = useListJobOffers(recruiter.data?.company_id || "", accessToken);
  const {
    data: eligibleCandidatesData,
    isLoading: isEligibleCandidatesLoading,
    error: eligibleCandidatesError,
  } = useListEligibleCandidates(selectedJobOffer?.id || "", accessToken, candidatesPage);
  const hireCandidateMutation = useHireCandidate(accessToken);
  const {
    data: hireRequestsData,
    isLoading: isHireRequestsLoading,
    error: hireRequestsError,
  } = useGetHireRequests(accessToken, hireRequestFilter || undefined);

  const {
    data: leaderboardData,
    isLoading: isLeaderboardLoading,
    error: leaderboardError,
  } = useGetLaunchpadLeaderboard({
    pageIndex: leaderboardPage,
    perPage: leaderboardPerPage,
    search: leaderboardSearch || undefined,
  });

  const transformedHireRequests: JobInvite[] =
    hireRequestsData?.response?.data?.hire_requests?.map((request: any) => ({
      id: request.application_id,
      candidateId: request.student_info.id,
      jobId: request.job_info.id,
      candidateName: request.student_info.full_name,
      title: request.job_info.title,
      company_id: request.job_info.company_id,
      salaryRange: request.job_info.salary_range || null,
      location: request.job_info.location || null,
      experience: request.job_info.experience || null,
      skills: request.job_info.skills || null,
      jobType: request.job_info.job_type || null,
      status: request.status,
      interestGroups:
        request.student_info.interest_groups
          ?.map((ig: any) => ig.name)
          .join(", ") || "",
      minKarma: request.job_info.min_karma || 0,
      task_id: request.job_info.task_id || null,
      task_description: request.job_info.task_description || null,
      task_hashtag: request.job_info.task_hashtag || null,
      task_verified: request.job_info.task_verified || null,
      sentDate: request.timeline.invited_at
        ? new Date(request.timeline.invited_at).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      updatedAt: request.timeline.updated_at
        ? new Date(request.timeline.updated_at).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      openingType: request.job_info.opening_type || null,
      application_id: request.application_id,
      resume_link: request.application_details?.resume_link || null,
      linkedin_link: request.application_details?.linkedin_link || null,
      portfolio_link: request.application_details?.portfolio_link || null,
      cover_letter: request.application_details?.cover_letter || null,
      other_link: request.application_details?.other_link || null,
      // Add interview details if available
      interview_date: request.interview_details?.interview_date || null,
      interview_time: request.interview_details?.interview_time || null,
      interview_platform: request.interview_details?.interview_platform || null,
      interview_link: request.interview_details?.interview_link || null,
    })) || [];

  useEffect(() => {
    if (recruiter.data?.company_id) {
      setNewJobOffer((prev) => ({
        ...prev,
        company_id: recruiter.data!.company_id,
      }));
    }
  }, [recruiter.data]);

  // Now conditional logic can be placed after all hooks
  if (recruiter.isLoading || isJobOffersLoading) {
    return <div className="text-white">Loading...</div>;
  }

  if (!recruiter.data) {
    router.push("/login");
    return null;
  }

  if (jobOffersError) {
    return (
      <div className="text-red-400">
        Error loading job offers: {jobOffersError.message}
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    window.location.href = "/login";
  };

  const handleInviteSent = (newInvite: JobInvite) => {
    setHireRequests((prev) => [...prev, newInvite]);
  };

  const handleScheduleInterview = (inviteId: number) => {
    const invite = hireRequests.find((req) => req.id === inviteId);
    if (invite && invite.application_id) {
      setScheduleInviteId(inviteId);
      setIsScheduleModalOpen(true);
    } else {
      console.error("No application_id found for invite:", inviteId);
    }
  };

  const handleScheduleSubmit = (details: InterviewDetails) => {
    if (scheduleInviteId !== null) {
      setHireRequests((prev) =>
        prev.map((invite) =>
          invite.id === scheduleInviteId
            ? {
                ...invite,
                status: "interview",
                interview_date: details.interview_date,
                interview_time: details.interview_time,
                interview_platform: details.interview_platform,
                interview_link: details.interview_link,
                updatedAt: new Date().toISOString().split("T")[0],
              }
            : invite
        )
      );
      queryClient.invalidateQueries({
        queryKey: ["eligible-candidates", selectedJobOffer?.id],
      });
      queryClient.invalidateQueries({ queryKey: ["hire-requests"] });
    }
    setIsScheduleModalOpen(false);
    setScheduleInviteId(null);
  };

  const handleViewJobDetails = (jobId: string) => {
    // First try to find the job in the existing jobOffers data
    const jobOffer = jobOffers?.response?.find(
      (offer: JobOffer) => offer.id === jobId
    );

    if (jobOffer) {
      setSelectedJobOffer(jobOffer);
      setCandidatesPage(1); // Reset to first page when viewing new job
      setIsDetailsModalOpen(true);
    } else {
      // If not found in jobOffers, create it from the hire request data
      const hireRequest = transformedHireRequests.find(
        (req) => req.jobId === jobId
      );
      if (hireRequest) {
        const constructedJobOffer: JobOffer = {
          id: hireRequest.jobId || "",
          title: hireRequest.title,
          company_id: hireRequest.company_id,
          salaryRange: hireRequest.salaryRange,
          location: hireRequest.location,
          experience: hireRequest.experience,
          skills: hireRequest.skills,
          jobType: hireRequest.jobType,
          interestGroups: hireRequest.interestGroups,
          minKarma: hireRequest.minKarma,
          task_id: hireRequest.task_id,
          task_description: hireRequest.task_description,
          task_hashtag: hireRequest.task_hashtag,
          task_verified: hireRequest.task_verified,
          createdAt: hireRequest.sentDate,
          openingType: hireRequest.openingType,
        };

        setSelectedJobOffer(constructedJobOffer);
        setCandidatesPage(1); // Reset to first page when viewing new job
        setIsDetailsModalOpen(true);
      } else {
        console.error("Job offer not found for jobId:", jobId);
        toast.error("Job details not found");
      }
    }
  };

  const handleCandidatesPageChange = (page: number) => {
    setCandidatesPage(page);
  };

  const handleEditJobOffer = (job: JobOffer) => {
    setNewJobOffer(job);
    setIsCreateModalOpen(true);
  };

  const handleDeleteJobOffer = async (job: JobOffer) => {
    if (
      confirm(
        "Are you sure you want to delete this job offer? This action cannot be undone."
      )
    ) {
      const t = toast.loading("Deleting job offer...");
      try {
        await apiHandler.delete(`/launchpad/job/${job.id}/`,{
          headers:{
            "Authorization": `Bearer ${accessToken}`,
          }
        });
        await refetchJobOffers();
        toast.success("Job offer deleted successfully", { id: t });
      } catch (error) {
        console.error("Error deleting job offer:", error);
        toast.error(`Error deleting job offer`, { id: t });
      }
    }
  };

  const handleLeaderboardPageChange = (pageIndex: number) => {
    setLeaderboardPage(pageIndex);
  };

  const handleLeaderboardPerPageChange = (perPage: number) => {
    setLeaderboardPerPage(perPage);
    setLeaderboardPage(1); // Reset to first page when changing per page
  };

  const handleLeaderboardSearchSubmit = (search: string) => {
    setLeaderboardSearch(search);
    setLeaderboardPage(1); // Reset to first page when searching
  };

  const handleLeaderboardSearchClear = () => {
    setLeaderboardSearch("");
    setLeaderboardPage(1); // Reset to first page when clearing
  };

  const handleHireCandidate = async (
    inviteId: number,
    application_id: string
  ) => {
    const t = toast.loading("Hiring candidate...");
    try {
      await hireCandidateMutation.mutateAsync({
        application_id: application_id,
        decision: "accepted",
      });

      toast.success("Candidate hired successfully", { id: t });

      setHireRequests((prev) =>
        prev.map((invite) =>
          invite.id === inviteId
            ? {
                ...invite,
                status: "hired",
                updatedAt: new Date().toISOString().split("T")[0],
              }
            : invite
        )
      );
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({
        queryKey: ["eligible-candidates", selectedJobOffer?.id],
      });
      queryClient.invalidateQueries({ queryKey: ["hire-requests"] });
      toast.success("Candidate marked as hired!");
    } catch (error) {
      toast.error(`Error hiring candidate.`, { id: t });
    }
  };

  const handleRejectCandidate = async (
    inviteId: number,
    application_id: string
  ) => {
    const t = toast.loading("Rejecting candidate...");
    try {
      await hireCandidateMutation.mutateAsync({
        application_id: application_id,
        decision: "rejected",
      });

      toast.success("Candidate rejected", { id: t });

      setHireRequests((prev) =>
        prev.map((invite) =>
          invite.id === inviteId
            ? {
                ...invite,
                status: "rejected",
                updatedAt: new Date().toISOString().split("T")[0],
              }
            : invite
        )
      );
    } catch (error) {
      toast.error(`Error rejecting candidate.`, { id: t });
    }
  };

  const handleViewCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsCandidateModalOpen(true);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 p-6">
      <div className="max-w-7xl mx-auto">
        <Header userEmail={userEmail} onLogout={handleLogout} />
        {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Total Candidates"
            value={eligibleCandidatesData?.response?.data?.length || 0}
            icon={<Users className="h-5 w-5 text-primary-500" />}
            color="bg-primary-500/10"
          />
          <StatCard
            title="Hire Requests Sent"
            value={hireRequests.length}
            icon={<Briefcase className="h-5 w-5 text-blue-400" />}
            color="bg-blue-500/10"
          />
          <StatCard
            title="Interviews Scheduled"
            value={hireRequests.filter((req) => req.status === "interview").length}
            icon={<Calendar className="h-5 w-5 text-green-400" />}
            color="bg-green-500/10"
          />
          <StatCard
            title="Hiring Rate"
            value="33%"
            icon={<TrendingUp className="h-5 w-5 text-purple-400" />}
            color="bg-purple-500/10"
          />
        </div> */}
        <TabsNavigation
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            // Reset leaderboard filters when switching to leaderboard tab
            if (tab === "leaderboard") {
              if (leaderboardPage !== 1) setLeaderboardPage(1);
              if (leaderboardSearch) {
                setLeaderboardSearch("");
              }
            }
          }}
        />
        <div className="mt-4">
          {activeTab === "job-offers" && (
            <JobOffersTab
              jobOffers={jobOffers}
              isLoading={isJobOffersLoading}
              error={jobOffersError}
              onCreateJobOffer={() => setIsCreateModalOpen(true)}
              onViewDetails={(offer) => {
                setSelectedJobOffer(offer);
                setCandidatesPage(1); // Reset to first page when viewing job
                setIsDetailsModalOpen(true);
              }}
              onEditJobOffer={handleEditJobOffer}
              onDeleteJobOffer={handleDeleteJobOffer}
            />
          )}
          {activeTab === "requests" && (
            <HireRequestsTab
              hireRequests={transformedHireRequests}
              onViewJobDetails={handleViewJobDetails}
              // isLoading={isHireRequestsLoading}
              // error={hireRequestsError}
              // summary={hireRequestsData?.response?.data?.summary}
              // pagination={hireRequestsData?.response?.pagination}
              // onFilterChange={setHireRequestFilter}
              // currentFilter={hireRequestFilter}
            />
          )}
          {activeTab === "analytics" && <AnalyticsTab />}
          {activeTab === "leaderboard" && (
            <LeaderboardTab
              students={leaderboardData?.data || []}
              isLoading={isLeaderboardLoading}
              error={leaderboardError}
              currentPage={leaderboardPage}
              totalPages={leaderboardData?.pagination?.totalPages || 1}
              totalCount={leaderboardData?.pagination?.count || 0}
              hasNext={leaderboardData?.pagination?.isNext || false}
              hasPrev={leaderboardData?.pagination?.isPrev || false}
              perPage={leaderboardPerPage}
              searchQuery={leaderboardSearch}
              onPageChange={handleLeaderboardPageChange}
              onPerPageChange={handleLeaderboardPerPageChange}
              onSearchSubmit={handleLeaderboardSearchSubmit}
              onSearchClear={handleLeaderboardSearchClear}
            />
          )}
        </div>
        <CreateJobOfferModal
          isOpen={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          newJobOffer={newJobOffer}
          setNewJobOffer={setNewJobOffer}
          interestGroups={interestGroups}
          isInterestGroupsLoading={isInterestGroupsLoading}
          interestGroupsError={interestGroupsError}
          addJobMutation={addJobMutation as any}
          updateJobMutation={updateJobMutation}
          companyId={recruiter.data?.company_id}
          userId={userId}
          queryClient={queryClient}
        />
        <JobOfferDetailsModal
          isOpen={isDetailsModalOpen}
          onOpenChange={setIsDetailsModalOpen}
          selectedJobOffer={selectedJobOffer}
          eligibleCandidatesData={eligibleCandidatesData}
          isEligibleCandidatesLoading={isEligibleCandidatesLoading}
          eligibleCandidatesError={eligibleCandidatesError}
          hireRequests={hireRequests}
          accessToken={accessToken}
          onScheduleInterview={handleScheduleInterview}
          onHireCandidate={handleHireCandidate}
          onInviteSent={handleInviteSent}
          currentPage={candidatesPage}
          onPageChange={handleCandidatesPageChange}
        />
        <ScheduleInterviewModal
          isOpen={isScheduleModalOpen}
          onOpenChange={setIsScheduleModalOpen}
          onScheduleSubmit={handleScheduleSubmit}
          accessToken={accessToken}
          applicationId={
            scheduleInviteId !== null
              ? hireRequests.find((req) => req.id === scheduleInviteId)
                  ?.application_id || ""
              : ""
          }
        />
        <CandidateDetailsModal
          isOpen={isCandidateModalOpen}
          onOpenChange={setIsCandidateModalOpen}
          candidate={selectedCandidate}
        />
      </div>
    </div>
  );
}
