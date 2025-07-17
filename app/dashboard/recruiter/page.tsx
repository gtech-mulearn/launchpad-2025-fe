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
import { Users, Briefcase, Calendar, TrendingUp } from "lucide-react";
import { useLocalStorage } from "@/hooks/misc";
import { useGetRecruiter } from "@/hooks/auth";
import {
  useAddJob,
  useListJobOffers,
  useListEligibleCandidates,
} from "@/hooks/recuiter";
import {
  JobOffer,
  JobInvite,
  Candidate,
  InterviewDetails,
  InterestGroup,
} from "@/types/recruiter";

// Mock data for candidates (for candidates tab)
const mockCandidates: Candidate[] = [
  {
    id: "1",
    full_name: "John Doe",
    email: "john@example.com",
    muid: "john_doe@mulearn",
    profile_pic: null,
    karma: 600,
    level: "lvl1",
    college_name: "Example University",
    interest_groups: [
      { id: "1", name: "Web Development" },
      { id: "2", name: "Mobile Development" },
    ],
    roles: ["Student", "Code Explorer"],
    rank: 10,
    karma_distribution: [{ task_type: "Contribution", karma: 600 }],
  },
  {
    id: "2",
    full_name: "Jane Smith",
    email: "jane@example.com",
    muid: "jane_smith@mulearn",
    profile_pic: null,
    karma: 800,
    level: "lvl2",
    college_name: "Tech Institute",
    interest_groups: [
      { id: "3", name: "Cloud And Devops" },
      { id: "4", name: "Data Science" },
    ],
    roles: ["Student", "Code Master"],
    rank: 5,
    karma_distribution: [{ task_type: "Collaboration", karma: 800 }],
  },
  {
    id: "3",
    full_name: "Mike Johnson",
    email: "mike@example.com",
    muid: "mike_johnson@mulearn",
    profile_pic: null,
    karma: 550,
    level: "lvl1",
    college_name: "State College",
    interest_groups: [
      { id: "5", name: "Cyber Security" },
      { id: "6", name: "Blockchain" },
    ],
    roles: ["Student", "Intern"],
    rank: 15,
    karma_distribution: [{ task_type: "Participation", karma: 550 }],
  },
];

// Mock data for hire requests
const mockHireRequests: JobInvite[] = [
  {
    id: 1,
    candidateName: "Sreenandan K M",
    title: "FullStack dev",
    company_id: "e34fb4f2-cff2-4be1-8444-a02967e09020",
    salaryRange: "$80,000 - $120,000",
    location: "Remote",
    experience: "3-5 years",
    skills: "Join our team to build cutting-edge React applications...",
    jobType: "Full-time",
    status: "pending",
    interestGroups: "Web Development",
    minKarma: 500,
    task_id: null,
    task_description: null,
    task_hashtag: null,
    task_verified: null,
    sentDate: "2024-01-15",
    updatedAt: "2024-01-20",
    openingType: "General",
  },
  {
    id: 2,
    candidateName: "Aryan C",
    title: "Backend Developer",
    company_id: "e34fb4f2-cff2-4be1-8444-a02967e09020",
    salaryRange: "$90,000 - $140,000",
    location: "New York",
    experience: "5-7 years",
    skills: "Lead backend development for our platform...",
    jobType: "Full-time",
    status: "accepted",
    interestGroups: "Cloud And Devops",
    minKarma: 750,
    task_id: null,
    task_description: null,
    task_hashtag: null,
    task_verified: null,
    sentDate: "2024-01-14",
    updatedAt: "2024-01-18",
    openingType: "Task",
  },
  {
    id: 3,
    candidateName: "AKSHAY KRISHNA",
    title: "test task type",
    company_id: "56c8a2ce-e3e2-4611-ba71-5b780a944180",
    salaryRange: "$8000 - $90000",
    location: "kochu",
    experience: "8",
    skills: "enter job skills and description",
    jobType: "Part-time",
    status: "interview",
    interestGroups: "Ar Vr Mr",
    minKarma: 855,
    task_id: "77ea2701-c17c-48b9-a739-e2377f9e0ada",
    task_description: "some desc",
    task_hashtag: null,
    task_verified: false,
    sentDate: "2024-01-13",
    updatedAt: "2024-01-19",
    interviewDate: "2024-01-25",
    interviewTime: "10:00 AM",
    interviewPlatform: "Zoom",
    interviewLink: "https://zoom.us/j/123456789",
    openingType: "Task",
  },
];

export default function RecruiterDashboard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [userEmail, setUserEmail] = useState("");
  const [activeTab, setActiveTab] = useState("candidates");
  const [accessToken] = useLocalStorage("accessToken", "");
  const [userId] = useLocalStorage("userId", "");
  const [hireRequests, setHireRequests] =
    useState<JobInvite[]>(mockHireRequests);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedJobOffer, setSelectedJobOffer] = useState<JobOffer | null>(
    null
  );
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

  useEffect(() => {
    if (recruiter.data?.company_id) {
      setNewJobOffer((prev) => ({
        ...prev,
        company_id: recruiter.data!.company_id,
      }));
    }
  }, [recruiter.data]);

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

  const handleAcceptInvite = (inviteId: number) => {
    setHireRequests((prev) =>
      prev.map((invite) =>
        invite.id === inviteId
          ? {
              ...invite,
              status: "accepted",
              updatedAt: new Date().toISOString().split("T")[0],
            }
          : invite
      )
    );
  };

  const handleScheduleInterview = (inviteId: number) => {
    setScheduleInviteId(inviteId);
    setIsScheduleModalOpen(true);
  };

  const handleScheduleSubmit = (details: InterviewDetails) => {
    if (scheduleInviteId !== null) {
      setHireRequests((prev) =>
        prev.map((invite) =>
          invite.id === scheduleInviteId
            ? {
                ...invite,
                status: "interview",
                interviewDate: details.interviewDate,
                interviewTime: details.interviewTime,
                interviewPlatform: details.interviewPlatform,
                interviewLink: details.interviewLink,
                updatedAt: new Date().toISOString().split("T")[0],
              }
            : invite
        )
      );
    }
    setIsScheduleModalOpen(false);
    setScheduleInviteId(null);
  };

  const handleHireCandidate = (inviteId: number) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 p-6">
      <div className="max-w-7xl mx-auto">
        <Header userEmail={userEmail} onLogout={handleLogout} />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Total Candidates"
            value={mockCandidates.length}
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
        </div>
        <TabsNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="mt-4">
          {activeTab === "candidates" && (
            <CandidatesTab candidates={mockCandidates} />
          )}
          {activeTab === "job-offers" && (
            <JobOffersTab
              jobOffers={jobOffers}
              isLoading={isJobOffersLoading}
              error={jobOffersError}
              onCreateJobOffer={() => setIsCreateModalOpen(true)}
              onViewDetails={(offer) => {
                console.log("Selected Job Offer:", offer);
                setSelectedJobOffer(offer);
                setIsDetailsModalOpen(true);
              }}
            />
          )}
          {activeTab === "requests" && (
            <HireRequestsTab hireRequests={hireRequests} />
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
          onAcceptInvite={handleAcceptInvite}
          onScheduleInterview={handleScheduleInterview}
          onHireCandidate={handleHireCandidate}
          onInviteSent={handleInviteSent}
        />
        <ScheduleInterviewModal
          isOpen={isScheduleModalOpen}
          onOpenChange={setIsScheduleModalOpen}
          onScheduleSubmit={handleScheduleSubmit}
        />
      </div>
    </div>
  );
}

// Custom hook to fetch interest groups (unchanged, included for completeness)
const useGetInterestGroups = (accessToken: string) => {
  const [interestGroups, setInterestGroups] = useState<InterestGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInterestGroups = async () => {
      try {
        const response = await fetch(
          "https://mulearn.org/api/v1/dashboard/ig/list/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch interest groups");
        }
        const data = await response.json();
        if (data.hasError) {
          throw new Error(data.message || "Error fetching interest groups");
        }
        setInterestGroups(data.response.interestGroup);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setIsLoading(false);
      }
    };

    if (accessToken) {
      fetchInterestGroups();
    }
  }, [accessToken]);

  return { interestGroups, isLoading, error };
};
