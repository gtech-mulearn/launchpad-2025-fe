"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/recruiter/Header";
import { StatCard } from "@/components/recruiter/StatCard";
import { TabsNavigation } from "@/components/recruiter/TabsNavigation";
import { CandidatesTab } from "@/components/recruiter/CandidatesTab";
import { JobOffersTab } from "@/components/recruiter/JobOffersTab";
import { HireRequestsTab } from "@/components/recruiter/HireRequestsTab";
import { AnalyticsTab } from "@/components/recruiter/AnalyticsTab";
import { LeaderboardTab } from "@/components/recruiter/LeaderboardTab";
import { CreateJobOfferModal } from "@/components/recruiter/CreateJobOfferModal";
import { JobOfferDetailsModal } from "@/components/recruiter/JobOfferDetailsModal";
import { ScheduleInterviewModal } from "@/components/recruiter/ScheduleInterviewModal";
import { CandidateDetailsModal } from "@/components/recruiter/CandidateDetailsModal";
import { Users, Briefcase, Calendar, TrendingUp } from "lucide-react";
import { useLocalStorage } from "@/hooks/misc";
import { useGetRecruiter } from "@/hooks/auth";
import {
  useAddJob,
  useListJobOffers,
  useListEligibleCandidates,
  useGetLaunchpadLeaderboard,
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

export default function RecruiterDashboard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("job-offers");
  const [accessToken] = useLocalStorage("accessToken", "");
  const [userId] = useLocalStorage("userId", "");
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
  const [scheduleInviteId, setScheduleInviteId] = useState<number | null>(null);
  const [leaderboardPage, setLeaderboardPage] = useState(1);
  const [leaderboardPerPage, setLeaderboardPerPage] = useState(10);
  const [leaderboardSearch, setLeaderboardSearch] = useState("");
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

  const recruiter = useGetRecruiter(userId, accessToken);
  const addJobMutation = useAddJob(accessToken);
  const {
    interestGroups,
    isLoading: isInterestGroupsLoading,
    error: interestGroupsError,
  } = useGetInterestGroups(accessToken);
  const {
    data: jobOffers,
    isLoading: isJobOffersLoading,
    error: jobOffersError,
  } = useListJobOffers(recruiter.data?.company_id || "", accessToken);
  const {
    data: eligibleCandidatesData,
    isLoading: isEligibleCandidatesLoading,
    error: eligibleCandidatesError,
  } = useListEligibleCandidates(selectedJobOffer?.id || "", accessToken);
  
  const {
    data: leaderboardData,
    isLoading: isLeaderboardLoading,
    error: leaderboardError,
  } = useGetLaunchpadLeaderboard({
    page: leaderboardPage,
    perPage: leaderboardPerPage,
    search: leaderboardSearch || undefined,
  });

  useEffect(() => {
    if (recruiter.data?.company_id) {
      setNewJobOffer((prev) => ({
        ...prev,
        company_id: recruiter.data!.company_id,
      }));
    }
  }, [recruiter.data]);

  if (recruiter.isLoading || isJobOffersLoading) {
    return (
      <div className="flex items-center justify-center">
        <h3>Loading...</h3>
      </div>
    );
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
    const t = toast.loading("Logging out...");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    toast.success("Logged out successfully", { id: t });
    router.push("/login");
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
      const t = toast.loading("Scheduling interview...");
      setHireRequests((prev) =>
        prev.map((invite) =>
          invite.id === scheduleInviteId
            ? {
                ...invite,
                status: "interview",
                interviewDate: details.interview_date,
                interviewTime: details.interview_time,
                interviewPlatform: details.interview_platform,
                interviewLink: details.interview_link,
                updatedAt: new Date().toISOString().split("T")[0],
              }
            : invite
        )
      );
      toast.success("Interview scheduled successfully", { id: t });
    }
    setIsScheduleModalOpen(false);
    setScheduleInviteId(null);
  };

  const handleHireCandidate = async (
    inviteId: number,
    application_id: string
  ) => {
    const t = toast.loading("Hiring candidate...");
    try {
      await apiHandler.post(
        "launchpad/application-final-decision/",
        {
          application_id: application_id,
          decision: "accepted",
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      toast.success("Candidate hired successfully", { id: t });
    } catch (error) {
      toast.error(`Error hiring candidate.`, { id: t });
    }
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
  };

  const handleViewJobDetails = (jobId: string) => {
    const jobOffer = jobOffers?.jobs?.response?.find(
      (offer: JobOffer) => offer.id === jobId
    );
    if (jobOffer) {
      setSelectedJobOffer(jobOffer);
      setIsDetailsModalOpen(true);
    } else {
      console.error("Job offer not found for jobId:", jobId);
    }
  };

  const handleViewCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsCandidateModalOpen(true);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 p-6">
      <div className="max-w-7xl mx-auto">
        <Header userEmail={recruiter.data.name} onLogout={handleLogout} />
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
            value={
              hireRequests.filter((req) => req.status === "interview").length
            }
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
          {/* {activeTab === "candidates" && (
            <CandidatesTab
              candidates={eligibleCandidatesData?.response?.data || []}
              onViewCandidate={handleViewCandidate}
            />
          )} */}
          {activeTab === "job-offers" && (
            <JobOffersTab
              jobOffers={jobOffers?.jobs}
              isLoading={isJobOffersLoading}
              error={jobOffersError}
              onCreateJobOffer={() => setIsCreateModalOpen(true)}
              onViewDetails={(offer) => {
                setSelectedJobOffer(offer);
                setIsDetailsModalOpen(true);
              }}
            />
          )}
          {activeTab === "requests" && (
            <HireRequestsTab
              hireRequests={hireRequests}
              onViewJobDetails={handleViewJobDetails}
            />
          )}
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
          {activeTab === "analytics" && <AnalyticsTab />}
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
