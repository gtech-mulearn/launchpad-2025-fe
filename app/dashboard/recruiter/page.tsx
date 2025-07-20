"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/recruiter/Header";
import { StatCard } from "@/components/recruiter/StatCard";
import { TabsNavigation } from "@/components/recruiter/TabsNavigation";
import { CandidatesTab } from "@/components/recruiter/CandidatesTab";
import { JobOffersTab } from "@/components/recruiter/JobOffersTab";
import { HireRequestsTab } from "@/components/recruiter/HireRequestsTab";
import { AnalyticsTab } from "@/components/recruiter/AnalyticsTab";
import { CreateJobOfferModal } from "@/components/recruiter/CreateJobOfferModal";
import { JobOfferDetailsModal } from "@/components/recruiter/JobOfferDetailsModal";
import { ScheduleInterviewModal } from "@/components/recruiter/ScheduleInterviewModal";
import { CandidateDetailsModal } from "@/components/recruiter/CandidateDetailsModal";
import { Users, Briefcase, Calendar, TrendingUp } from "lucide-react";
import { useLocalStorage } from "@/hooks/misc";
import { useGetRecruiter } from "@/hooks/auth";
import { useAddJob, useListJobOffers, useListEligibleCandidates, useHireCandidate } from "@/hooks/recuiter";
import { JobOffer, JobInvite, Candidate, InterviewDetails } from "@/types/recruiter";
import { toast } from "sonner";

// Move this hook outside the component or to a separate file
const useGetInterestGroups = (accessToken: string) => {
  const [interestGroups, setInterestGroups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInterestGroups = async () => {
      try {
        const response = await fetch("https://mulearn.org/api/v1/dashboard/ig/list/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!response.ok) throw new Error("Failed to fetch interest groups");
        const data = await response.json();
        if (data.hasError) throw new Error(data.message || "Error fetching interest groups");
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
  const [selectedJobOffer, setSelectedJobOffer] = useState<JobOffer | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleInviteId, setScheduleInviteId] = useState<number | null>(null);
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
  const { interestGroups, isLoading: isInterestGroupsLoading, error: interestGroupsError } = useGetInterestGroups(accessToken);
  const { data: jobOffers, isLoading: isJobOffersLoading, error: jobOffersError } = useListJobOffers(recruiter.data?.company_id || "", accessToken);
  const { data: eligibleCandidatesData, isLoading: isEligibleCandidatesLoading, error: eligibleCandidatesError } = useListEligibleCandidates(selectedJobOffer?.id || "", accessToken);
  const hireCandidateMutation = useHireCandidate(accessToken);

  useEffect(() => {
    if (recruiter.data?.company_id) {
      setNewJobOffer((prev) => ({ ...prev, company_id: recruiter.data!.company_id }));
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
    return <div className="text-red-400">Error loading job offers: {jobOffersError.message}</div>;
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
    }
    setIsScheduleModalOpen(false);
    setScheduleInviteId(null);
  };

  console.log(hireRequests, "hireRequests");
  const handleViewJobDetails = (jobId: string) => {
    const jobOffer = jobOffers?.response?.find((offer: JobOffer) => offer.id === jobId);
    if (jobOffer) {
      setSelectedJobOffer(jobOffer);
      setIsDetailsModalOpen(true);
    } else {
      console.error("Job offer not found for jobId:", jobId);
    }
  };

  const handleHireCandidate = async (
    inviteId: number,
    application_id: string,
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
    } catch (error) {
      toast.error(`Error hiring candidate.`, { id: t });
    }
  };

  const handleRejectCandidate = async (
    inviteId: number,
    application_id: string,
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
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
        </div>
        <TabsNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="mt-4">
          {activeTab === "job-offers" && (
            <JobOffersTab
              jobOffers={jobOffers}
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
            <HireRequestsTab hireRequests={hireRequests} onViewJobDetails={handleViewJobDetails} />
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
              ? hireRequests.find((req) => req.id === scheduleInviteId)?.application_id || ""
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