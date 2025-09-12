"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Users,
  CheckCircle,
  TrendingUp,
  LogOut,
  Search,
  Eye,
  MessageSquare,
  Briefcase,
  Calendar,
  Plus,
} from "lucide-react";
import { useLocalStorage } from "@/hooks/misc";
import { useGetCompany } from "@/hooks/auth";
import { VerificationPending } from "@/components/verification-pending";
import { JobOffersTab } from "@/components/recruiter/JobOffersTab";
import { HireRequestsTab } from "@/components/recruiter/HireRequestsTab";
import { AnalyticsTab } from "@/components/recruiter/AnalyticsTab";
import { CreateJobOfferModal } from "@/components/recruiter/CreateJobOfferModal";
import { JobOfferDetailsModal } from "@/components/recruiter/JobOfferDetailsModal";
import { ScheduleInterviewModal } from "@/components/recruiter/ScheduleInterviewModal";
import { CandidateDetailsModal } from "@/components/recruiter/CandidateDetailsModal";
import { useAddJob, useListJobOffers, useListEligibleCandidates, useGetLaunchpadLeaderboard, useGetHireRequests } from "@/hooks/recuiter";
import { JobOffer, JobInvite, Candidate, InterviewDetails } from "@/types/recruiter";
import { LeaderboardTab } from "@/components/recruiter/LeaderboardTab";

// Mock data for demonstration - keeping only for approved candidates tab
const mockApprovedCandidates = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    skills: ["React", "Node.js", "TypeScript"],
    experience: "3 years",
    status: "Hired",
    availability: "Available",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    skills: ["Python", "Django", "PostgreSQL"],
    experience: "5 years",
    status: "Hired",
    availability: "Available",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    skills: ["Java", "Spring Boot", "AWS"],
    experience: "4 years",
    status: "Hired",
    availability: "Busy",
  },
];

export default function CompanyDashboard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [userEmail, setUserEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("job-offers");
  const [accessToken, setAccessToken] = useLocalStorage("accessToken", "");
  const [userId, setUserId] = useLocalStorage("userId", "");
  const [hireRequests, setHireRequests] = useState<JobInvite[]>([]);
  const [hireRequestFilter, setHireRequestFilter] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [selectedJobOffer, setSelectedJobOffer] = useState<JobOffer | null>(null);
  const [leaderboardPage, setLeaderboardPage] = useState(1);
  const [leaderboardPerPage, setLeaderboardPerPage] = useState(10);
  const [leaderboardSearch, setLeaderboardSearch] = useState("");
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

  const company = useGetCompany(userId, accessToken);
  const addJobMutation = useAddJob(accessToken);
  const { interestGroups, isLoading: isInterestGroupsLoading, error: interestGroupsError } = useGetInterestGroups(accessToken);
  const { data: jobOffers, isLoading: isJobOffersLoading, error: jobOffersError } = useListJobOffers(company.data?.id || "", accessToken);
  const { data: eligibleCandidatesData, isLoading: isEligibleCandidatesLoading, error: eligibleCandidatesError } = useListEligibleCandidates(selectedJobOffer?.id || "", accessToken);
  const {data: hireRequestsData, isLoading: isHireRequestsLoading, error: hireRequestsError} = useGetHireRequests(accessToken, hireRequestFilter || undefined);

  // Transform hire requests data
  const transformedHireRequests: JobInvite[] = hireRequestsData?.response?.data?.hire_requests?.map((request: any) => ({
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
    interestGroups: request.student_info.interest_groups?.map((ig: any) => ig.name).join(", ") || "",
    minKarma: request.job_info.min_karma || 0,
    task_id: request.job_info.task_id || null,
    task_description: request.job_info.task_description || null,
    task_hashtag: request.job_info.task_hashtag || null,
    task_verified: request.job_info.task_verified || null,
    sentDate: request.timeline.invited_at ? new Date(request.timeline.invited_at).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    updatedAt: request.timeline.updated_at ? new Date(request.timeline.updated_at).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    openingType: request.job_info.opening_type || null,
    application_id: request.application_id,
    resume_link: request.application_details?.resume_link || null,
    linkedin_link: request.application_details?.linkedin_link || null,
    portfolio_link: request.application_details?.portfolio_link || null,
    cover_letter: request.application_details?.cover_letter || null,
    other_link: request.application_details?.other_link || null,
    interview_date: request.interview_details?.interview_date || null,
    interview_time: request.interview_details?.interview_time || null,
    interview_platform: request.interview_details?.interview_platform || null,
    interview_link: request.interview_details?.interview_link || null,
  })) || [];


  const {
    data: leaderboardData,
    isLoading: isLeaderboardLoading,
    error: leaderboardError,
  } = useGetLaunchpadLeaderboard({
    pageIndex: leaderboardPage,
    perPage: leaderboardPerPage,
    search: leaderboardSearch || undefined,
  });


  useEffect(() => {
    if (company.data?.id) {
      setNewJobOffer((prev) => ({ ...prev, company_id: company.data!.id }));
    }
  }, [company.data]);

  if (company.isLoading || isJobOffersLoading) {
    return <div className="text-white">Loading...</div>;
  }

  if (!company.data) {
    router.push("/login");
    return null;
  }

  if (jobOffersError) {
    return <div className="text-red-400">Error loading job offers: {jobOffersError.message}</div>;
  }
  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");

    // Force a page reload to clear any cached state
    router.push("/login");
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
              interviewDate: details.interview_date,
              interviewTime: details.interview_time,
              interviewPlatform: details.interview_platform,
              interviewLink: details.interview_link,
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
          ? { ...invite, status: "hired", updatedAt: new Date().toISOString().split("T")[0] }
          : invite
      )
    );
  };

  const handleViewJobDetails = (jobId: string) => {
    // First try to find the job in the existing jobOffers data
    const jobOffer = jobOffers?.response?.find((offer: JobOffer) => offer.id === jobId);
    
    if (jobOffer) {
      setSelectedJobOffer(jobOffer);
      setIsDetailsModalOpen(true);
    } else {
      // If not found in jobOffers, create it from the hire request data
      const hireRequest = transformedHireRequests.find(req => req.jobId === jobId);
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
        setIsDetailsModalOpen(true);
      } else {
        console.error("Job offer not found for jobId:", jobId);
      }
    }
  };

  const handleViewCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsCandidateModalOpen(true);
  };

  const filteredCandidates = mockApprovedCandidates.filter(
    (candidate) =>
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.skills.some((skill) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const hiringRate = hireRequests.length > 0
    ? Math.round((hireRequests.filter(req => req.status === "hired").length / hireRequests.length) * 100)
    : 0;

  // return <VerificationPending />;
  if (!company.data.is_verified) return <VerificationPending />;
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Company Dashboard
            </h1>
            <p className="text-gray-400">Welcome back {company.data.name}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="bg-button-secondary-500/30 border-primary-500/30 text-white hover:bg-primary-500/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Total Candidates"
            value={eligibleCandidatesData?.response?.data?.length || 0}
            icon={<Users className="h-5 w-5 text-primary-500" />}
            color="bg-primary-500/10"
          />
          <StatCard
            title="Job Offers"
            value={jobOffers?.response?.length || 0}
            icon={<Briefcase className="h-5 w-5 text-blue-400" />}
            color="bg-blue-500/10"
          />
          <StatCard
            title="Hire Requests Sent"
            value={hireRequests.length}
            icon={<Calendar className="h-5 w-5 text-green-400" />}
            color="bg-green-500/10"
          />
          <StatCard
            title="Hiring Rate"
            value={`${hiringRate}%`}
            icon={<TrendingUp className="h-5 w-5 text-purple-400" />}
            color="bg-purple-500/10"
          />
        </div> */}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="bg-secondary-800/50 backdrop-blur-sm border border-primary-500/20">
              <TabsTrigger
                value="job-offers"
                className="text-white data-[state=active]:bg-primary-500"
              >
                Job Offers
              </TabsTrigger>
              <TabsTrigger
                value="requests"
                className="text-white data-[state=active]:bg-primary-500"
              >
                Hire Requests
              </TabsTrigger>
              {/* <TabsTrigger
                value="leaderboard"
                className="text-white data-[state=active]:bg-primary-500"
              >
                Leaderboard
              </TabsTrigger> */}
              <TabsTrigger
                value="recruiters"
                className="text-white data-[state=active]:bg-primary-500"
              >
                Recruiters
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="text-white data-[state=active]:bg-primary-500"
              >
                Analytics
              </TabsTrigger>
            </TabsList>
            <Button
              asChild
              className="bg-transparent text-white border border-primary-500 hover:border-primary-400 px-6 py-2 text-sm uppercase tracking-widest font-medium transition-all duration-300 ml-4"
            >
              <a href="/register/recruiter">Register Recruiters</a>
            </Button>
          </div>

          {/* <TabsContent value="approved" className="space-y-4">
            <Card className="bg-secondary-800/50 backdrop-blur-md border border-primary-500/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">
                      Approved Candidates
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      List of candidates approved by your company
                    </CardDescription>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search candidates..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-secondary-700/50 border-primary-500/30 text-white"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">Candidate</TableHead>
                      <TableHead className="text-gray-300">Skills</TableHead>
                      <TableHead className="text-gray-300">
                        Experience
                      </TableHead>
                      <TableHead className="text-gray-300">
                        Availability
                      </TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCandidates.map((candidate) => (
                      <TableRow key={candidate.id} className="border-gray-700">
                        <TableCell>
                          <div>
                            <div className="font-medium text-white">
                              {candidate.name}
                            </div>
                            <div className="text-sm text-gray-400">
                              {candidate.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {candidate.skills.map((skill, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs border-primary-500/30 text-primary-400"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {candidate.experience}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              candidate.availability === "Available"
                                ? "border-green-500/30 text-green-400"
                                : "border-yellow-500/30 text-yellow-400"
                            }
                          >
                            {candidate.availability}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-button-secondary-500/30 border-primary-500/30 text-white"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              className="bg-primary-500 hover:bg-primary-600"
                            >
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Contact
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent> */}
          {activeTab === "recruiters" && (
            <TabsContent value="recruiters" className="space-y-4">
              <Card className="bg-secondary-800/50 backdrop-blur-md border border-primary-500/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">Recruiters</CardTitle>
                      <CardDescription className="text-gray-400">
                        Manage your recruiters and their access
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700">
                        <TableHead className="text-gray-300">Name</TableHead>
                        <TableHead className="text-gray-300">Email</TableHead>
                        <TableHead className="text-gray-300">Role</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {company.data.recruiters.map((recruiter: any) => (
                        <TableRow
                          key={recruiter.id}
                          className="border-gray-700"
                        >
                          <TableCell>
                            <div className="font-medium text-white">
                              {recruiter.name}
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-400">
                            {recruiter.email}
                          </TableCell>
                          <TableCell className="text-gray-400">
                            {recruiter.role}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
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
          {activeTab === "job-offers" && (
            <JobOffersTab
              jobOffers={jobOffers}
              isLoading={isJobOffersLoading}
              error={jobOffersError}
              showCreateButton={false}
              onCreateJobOffer={() => setIsCreateModalOpen(true)}
              onViewDetails={(offer) => {
                setSelectedJobOffer(offer);
                setIsDetailsModalOpen(true);
              }}
            />
          )}

          {activeTab === "requests" && (
            <HireRequestsTab 
              hireRequests={transformedHireRequests} 
              onViewJobDetails={handleViewJobDetails}
              // error={hireRequestsError}
              // summary={hireRequestsData?.response?.data?.summary}
              // pagination={hireRequestsData?.response?.pagination}
              // onFilterChange={setHireRequestFilter}
              // currentFilter={hireRequestFilter}
            />
          )}

          {activeTab === "analytics" && <AnalyticsTab />}
        </Tabs>

        {/* Modals */}
        {/* <CreateJobOfferModal
          isOpen={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          newJobOffer={newJobOffer}
          setNewJobOffer={setNewJobOffer}
          interestGroups={interestGroups}
          isInterestGroupsLoading={isInterestGroupsLoading}
          interestGroupsError={interestGroupsError}
          addJobMutation={addJobMutation as any}
          companyId={company.data?.id}
          userId={userId}
          queryClient={queryClient}
        /> */}

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
          showActions={false}
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

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Card className="bg-secondary-800/50 backdrop-blur-md border border-primary-500/20 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader
        className={`flex flex-row items-center justify-between space-y-0 pb-2 ${color}`}
      >
        <CardTitle className="text-sm font-medium text-white">
          {title}
        </CardTitle>
        <div className="rounded-full p-2">{icon}</div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="text-3xl font-bold text-white">{value}</div>
      </CardContent>
    </Card>
  );
}

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
