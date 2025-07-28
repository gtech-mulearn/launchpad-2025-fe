import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableHeader,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Calendar,
  Briefcase,
  ExternalLink,
  Clock,
  FileText,
  X,
} from "lucide-react";
import { JobOffer, Candidate, JobInvite } from "@/types/recruiter";
import { useSendJobInvitations } from "@/hooks/recuiter";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CoverLetterModal } from "./coverLetterModal";

interface JobOfferDetailsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedJobOffer: JobOffer | null;
  eligibleCandidatesData: any;
  isEligibleCandidatesLoading: boolean;
  eligibleCandidatesError: Error | null;
  hireRequests: JobInvite[];
  accessToken: string;
  onScheduleInterview: (inviteId: number) => void;
  onHireCandidate: (inviteId: number, application_id: string) => void;
  onInviteSent: (invite: JobInvite) => void;
  showActions?: boolean;
}

export const JobOfferDetailsModal: React.FC<JobOfferDetailsModalProps> = ({
  isOpen,
  onOpenChange,
  selectedJobOffer,
  eligibleCandidatesData,
  isEligibleCandidatesLoading,
  eligibleCandidatesError,
  hireRequests,
  accessToken,
  onScheduleInterview,
  onHireCandidate,
  onInviteSent,
  showActions = true,
}) => {
  const sendJobInvitationsMutation = useSendJobInvitations(accessToken);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (eligibleCandidatesData && selectedJobOffer) {
      eligibleCandidatesData.response.data.forEach((candidate: Candidate) => {
        const existingRequest = hireRequests.find(
          (req) =>
            req.candidateId === candidate.id &&
            req.jobId === selectedJobOffer.id
        );
        if (
          (candidate.application_status === "invited" ||
            candidate.application_status === "interview_scheduled" ||
            candidate.application_status === "applied") &&
          !existingRequest
        ) {
          const newInvite: JobInvite = {
            id: Date.now() + Math.random(),
            candidateId: candidate.id,
            jobId: selectedJobOffer.id,
            candidateName: candidate.full_name,
            title: selectedJobOffer.title,
            company_id: selectedJobOffer.company_id,
            salaryRange: selectedJobOffer.salaryRange,
            location: selectedJobOffer.location,
            experience: selectedJobOffer.experience,
            skills: selectedJobOffer.skills,
            jobType: selectedJobOffer.jobType,
            status:
              candidate.application_status === "interview_scheduled"
                ? "interview"
                : candidate.application_timeline?.applied_at
                ? "accepted"
                : "pending",
            interestGroups: selectedJobOffer.interestGroups,
            minKarma: selectedJobOffer.minKarma,
            task_id: selectedJobOffer.task_id,
            task_description: selectedJobOffer.task_description,
            task_hashtag: selectedJobOffer.task_hashtag,
            task_verified: selectedJobOffer.task_verified,
            sentDate:
              candidate.application_timeline?.invited_at ||
              new Date().toISOString().split("T")[0],
            updatedAt: new Date().toISOString().split("T")[0],
            openingType: selectedJobOffer.openingType,
            resume_link: candidate.candidate_links?.resume_link,
            linkedin_link: candidate.candidate_links?.linkedin_link,
            portfolio_link: candidate.candidate_links?.portfolio_link,
            cover_letter: candidate.candidate_links?.cover_letter,
            other_link: candidate.candidate_links?.other_link,
            // Only include application_id if candidate has applied (has application_id)
            ...(candidate.application_id && {
              application_id: candidate.application_id,
            }),
          };
          onInviteSent(newInvite);
        }
      });
    }
  }, [eligibleCandidatesData, selectedJobOffer, hireRequests, onInviteSent]);

  const getCandidateStatus = (
    candidate: Candidate,
    hireRequest?: JobInvite
  ) => {
    if (hireRequest?.status === "rejected") return "rejected";
    if (candidate.application_status === "interview_scheduled")
      return "interview";
    if (
      candidate.application_status === "applied" &&
      candidate.application_timeline?.applied_at
    )
      return "accepted";
    if (candidate.application_status === "invited") return "pending";
    if (candidate.application_status === "accepted") return "hired";
    return "no_invite";
  };

  const handleSendInvite = async (candidate: Candidate, offer: JobOffer) => {
    try {
      const t = toast.loading("Sending invitation...");

      await sendJobInvitationsMutation.mutateAsync({
        jobId: offer.id,
        studentIds: [candidate.id],
      });

      const newInvite: JobInvite = {
        id: Date.now() + Math.random(),
        candidateId: candidate.id,
        jobId: offer.id,
        candidateName: candidate.full_name,
        title: offer.title,
        company_id: offer.company_id,
        salaryRange: offer.salaryRange,
        location: offer.location,
        experience: offer.experience,
        skills: offer.skills,
        jobType: offer.jobType,
        status: "pending",
        interestGroups: offer.interestGroups,
        minKarma: offer.minKarma,
        task_id: offer.task_id,
        task_description: offer.task_description,
        task_hashtag: offer.task_hashtag,
        task_verified: offer.task_verified,
        sentDate: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
        openingType: offer.openingType,
      };

      onInviteSent(newInvite);

      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({
        queryKey: ["eligible-candidates", offer.id],
      });
      queryClient.invalidateQueries({ queryKey: ["hire-requests"] });

      toast.success("Invitation sent successfully!", { id: t });
    } catch (error) {
      console.error("Failed to send invitation:", error);
      toast.error("Failed to send invitation");
    }
  };

  const handleScheduleInterviewClick = (inviteId: number) => {
    onScheduleInterview(inviteId);

    // Invalidate queries after scheduling interview
    setTimeout(() => {
      queryClient.invalidateQueries({
        queryKey: ["eligible-candidates", selectedJobOffer?.id],
      });
      queryClient.invalidateQueries({ queryKey: ["hire-requests"] });
    }, 1000); // Small delay to allow backend to process
  };

  const handleHireCandidateClick = (
    inviteId: number,
    application_id: string
  ) => {
    onHireCandidate(inviteId, application_id);

    // Invalidate queries after hiring candidate
    setTimeout(() => {
      queryClient.invalidateQueries({
        queryKey: ["eligible-candidates", selectedJobOffer?.id],
      });
      queryClient.invalidateQueries({ queryKey: ["hire-requests"] });
    }, 1000); // Small delay to allow backend to process
  };

  // Mobile card view for candidates
  const CandidateCard = ({ candidate }: { candidate: Candidate }) => {
    const hireRequest = hireRequests.find(
      (req) =>
        req.candidateId === candidate.id &&
        req.jobId === selectedJobOffer!.id
    );
    const status = getCandidateStatus(candidate, hireRequest);

    return (
      <Card className="bg-secondary-700/50 border-primary-500/30 mb-4">
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Candidate Info */}
            <div>
              <div className="font-medium text-white text-lg">
                {candidate.full_name}
              </div>
              <div className="text-sm text-gray-300">
                <a
                  href={`https://mulearn.org/profile/${candidate.muid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  View Profile
                </a>
              </div>
              <div className="text-sm text-gray-400">{candidate.email}</div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-gray-400 font-medium">College</p>
                <p className="text-white">{candidate.college_name}</p>
              </div>
              <div>
                <p className="text-gray-400 font-medium">Karma</p>
                <p className="text-white">{candidate.karma}</p>
              </div>
              <div>
                <p className="text-gray-400 font-medium">Level</p>
                <p className="text-white">{candidate.level}</p>
              </div>
              <div>
                <p className="text-gray-400 font-medium">Rank</p>
                <p className="text-white">{candidate.rank}</p>
              </div>
            </div>

            {/* Interest Groups */}
            <div>
              <p className="text-gray-400 font-medium text-sm mb-2">
                Interest Groups
              </p>
              <div className="flex flex-wrap gap-1">
                {candidate.interest_groups.map((ig, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs border-primary-500/30 text-primary-400"
                  >
                    {ig.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between">
              <div>
                {status === "no_invite" && (
                  <Badge
                    variant="outline"
                    className="border-gray-500/30 text-gray-400"
                  >
                    No Invite
                  </Badge>
                )}
                {status === "pending" && (
                  <Badge
                    variant="outline"
                    className="border-yellow-500/30 text-yellow-400"
                  >
                    <Clock className="h-3 w-3 mr-1" /> Pending
                  </Badge>
                )}
                {status === "accepted" && (
                  <Badge
                    variant="outline"
                    className="border-green-500/30 text-green-400"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" /> Accepted
                  </Badge>
                )}
                {status === "interview" && (
                  <Badge
                    variant="outline"
                    className="border-blue-500/30 text-blue-400"
                  >
                    <Calendar className="h-3 w-3 mr-1" /> Interviewing
                  </Badge>
                )}
                {status === "hired" && (
                  <Badge
                    variant="outline"
                    className="border-purple-500/30 text-purple-400"
                  >
                    <Briefcase className="h-3 w-3 mr-1" /> Hired
                  </Badge>
                )}
                {status === "rejected" && (
                  <Badge
                    variant="outline"
                    className="border-red-500/30 text-red-400"
                  >
                    <X className="h-3 w-3 mr-1" /> Rejected
                  </Badge>
                )}
              </div>
            </div>

            {/* Application Links */}
            {(status === "accepted" ||
              status === "interview" ||
              status === "hired") && (
              <div>
                <p className="text-gray-400 font-medium text-sm mb-2">
                  Application Details
                </p>
                <div className="flex flex-wrap gap-2">
                  {candidate.candidate_links?.resume_link && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-button-secondary-500/30 border-primary-500/30 text-white text-xs"
                      asChild
                    >
                      <a
                        href={candidate.candidate_links?.resume_link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FileText className="h-3 w-3 mr-1" /> Resume
                      </a>
                    </Button>
                  )}
                  {candidate.candidate_links?.linkedin_link && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-button-secondary-500/30 border-primary-500/30 text-white text-xs"
                      asChild
                    >
                      <a
                        href={candidate.candidate_links?.linkedin_link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" /> LinkedIn
                      </a>
                    </Button>
                  )}
                  {candidate.candidate_links?.portfolio_link && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-button-secondary-500/30 border-primary-500/30 text-white text-xs"
                      asChild
                    >
                      <a
                        href={candidate.candidate_links?.portfolio_link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" /> Portfolio
                      </a>
                    </Button>
                  )}
                  {candidate.candidate_links?.cover_letter && (
                    <CoverLetterModal
                      name={candidate.full_name}
                      letter={candidate.candidate_links?.cover_letter || ""}
                    />
                  )}
                  {candidate.candidate_links?.other_link && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-button-secondary-500/30 border-primary-500/30 text-white text-xs"
                      asChild
                    >
                      <a
                        href={candidate.candidate_links?.other_link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" /> Other Link
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            {showActions && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-600">
                {status === "no_invite" && (
                  <Button
                    size="sm"
                    className="bg-primary-500 hover:bg-primary-600 flex-1 min-w-[120px]"
                    onClick={() =>
                      handleSendInvite(candidate, selectedJobOffer!)
                    }
                    disabled={sendJobInvitationsMutation.isPending}
                  >
                    {sendJobInvitationsMutation.isPending
                      ? "Sending..."
                      : "Send Invite"}
                  </Button>
                )}

                {status === "accepted" && hireRequest && (
                  <Button
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 flex-1 min-w-[140px]"
                    onClick={() => handleScheduleInterviewClick(hireRequest.id)}
                    disabled={!candidate.application_id}
                  >
                    <Calendar className="h-4 w-4 mr-1" /> Schedule Interview
                  </Button>
                )}
                {status === "interview" && hireRequest && (
                  <Button
                    size="sm"
                    className="bg-purple-500 hover:bg-purple-600 flex-1 min-w-[120px]"
                    onClick={() =>
                      handleHireCandidateClick(
                        hireRequest.id,
                        candidate.application_id!
                      )
                    }
                    disabled={!candidate.application_id}
                  >
                    <Briefcase className="h-4 w-4 mr-1" /> Mark as Hired
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-7xl h-[95vh] max-h-[95vh] bg-secondary-800/50 backdrop-blur-md border border-primary-500/20 text-white overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 px-4 sm:px-6">
          <DialogTitle className="text-lg sm:text-xl">
            {selectedJobOffer?.title} - Job Offer Details
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            View job offer details and manage eligible candidates.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto px-4 sm:px-6">
          {selectedJobOffer && (
            <div className="flex flex-col gap-6 pb-6">
              <Card className="bg-secondary-700/50 border-primary-500/30">
                <CardHeader>
                  <CardTitle className="text-white text-lg">
                    Job Offer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <p className="text-gray-400 font-medium">Title</p>
                      <p className="text-white">{selectedJobOffer.title}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-medium">Salary Range</p>
                      <p className="text-white">
                        {selectedJobOffer.salaryRange || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-medium">Location</p>
                      <p className="text-white">
                        {selectedJobOffer.location || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-medium">Experience</p>
                      <p className="text-white">
                        {selectedJobOffer.experience || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-medium">Job Type</p>
                      <p className="text-white">
                        {selectedJobOffer.jobType || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-medium">Interest Group</p>
                      <p className="text-white">
                        {selectedJobOffer.interestGroups || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-medium">Minimum Karma</p>
                      <p className="text-white">{selectedJobOffer.minKarma}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-medium">Opening Type</p>
                      <p className="text-white">
                        {selectedJobOffer.openingType || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 font-medium">
                      Skills/Description
                    </p>
                    <p className="text-white">
                      {selectedJobOffer.skills || "N/A"}
                    </p>
                  </div>
                  {selectedJobOffer.openingType === "Task" && (
                    <div className="border-t border-primary-500/20 pt-4">
                      <p className="text-gray-400 font-medium text-lg mb-2">
                        Task Details
                      </p>
                      <div className="grid gap-2">
                        <div>
                          <p className="text-gray-400 font-medium">
                            Task Description
                          </p>
                          <p className="text-white">
                            {selectedJobOffer.task_description || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 font-medium">
                            Task Hashtag
                          </p>
                          <p className="text-white">
                            {selectedJobOffer.task_hashtag || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 font-medium">
                            Task Verified
                          </p>
                          <p className="text-white">
                            {selectedJobOffer.task_verified ? "Yes" : "No"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="bg-secondary-700/50 border-primary-500/30">
                <CardHeader>
                  <CardTitle className="text-white text-lg">
                    Eligible Candidates
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Candidates matching the job offer's requirements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedJobOffer?.openingType === "Task" && !selectedJobOffer?.task_verified ? (
                    <div className="text-yellow-400 text-center p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Clock className="h-5 w-5" />
                        <span className="font-medium">Task Verification Pending</span>
                      </div>
                      <p>Candidate details will be shown after the task is verified by the admin.</p>
                    </div>
                  ) : isEligibleCandidatesLoading ? (
                    <div className="text-gray-400 text-center">
                      Loading eligible candidates...
                    </div>
                  ) : eligibleCandidatesData?.response?.data?.general?.[0] === "No matching tasks found for this job's hashtag." ? (
                    <div className="text-red-400 text-center">
                      No eligible candidates found.
                    </div>
                  ) : !eligibleCandidatesData?.response?.data?.length ? (
                    <div className="text-gray-400 text-center">
                      No eligible candidates found.
                    </div>
                  ) : eligibleCandidatesError ? (
                    <div className="text-red-400 text-center">
                      Error: {"Failed to load eligible candidates."}
                    </div>
                  ) : (
                    <>
                      {/* Desktop Table View - Hidden on mobile */}
                      <div className="hidden lg:block overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-gray-700">
                              <TableHead className="text-gray-300">
                                Candidate
                              </TableHead>
                              <TableHead className="text-gray-300">
                                Interest Groups
                              </TableHead>
                              <TableHead className="text-gray-300">College</TableHead>
                              <TableHead className="text-gray-300">Karma</TableHead>
                              <TableHead className="text-gray-300">Level</TableHead>
                              <TableHead className="text-gray-300">Rank</TableHead>
                              <TableHead className="text-gray-300">
                                Application Details
                              </TableHead>
                              <TableHead className="text-gray-300">Status</TableHead>
                              {showActions && (
                                <TableHead className="text-gray-300">
                                  Actions
                                </TableHead>
                              )}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {eligibleCandidatesData.response.data.map(
                              (candidate: Candidate) => {
                                const hireRequest = hireRequests.find(
                                  (req) =>
                                    req.candidateId === candidate.id &&
                                    req.jobId === selectedJobOffer.id
                                );
                                const status = getCandidateStatus(
                                  candidate,
                                  hireRequest
                                );

                                return (
                                  <TableRow
                                    key={candidate.id}
                                    className="border-gray-700"
                                  >
                                    <TableCell>
                                      <div>
                                        <div className="font-medium text-white">
                                          {candidate.full_name}
                                        </div>
                                        <div className="text-sm text-gray-300">
                                          <a
                                            href={`https://mulearn.org/profile/${candidate.muid}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:underline"
                                          >
                                            View Profile
                                          </a>
                                        </div>
                                        <div className="text-sm text-gray-400">
                                          {candidate.email}
                                        </div>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex flex-wrap gap-1">
                                        {candidate.interest_groups.map(
                                          (ig, index) => (
                                            <Badge
                                              key={index}
                                              variant="outline"
                                              className="text-xs border-primary-500/30 text-primary-400"
                                            >
                                              {ig.name}
                                            </Badge>
                                          )
                                        )}
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-gray-300">
                                      {candidate.college_name}
                                    </TableCell>
                                    <TableCell className="text-gray-300">
                                      {candidate.karma}
                                    </TableCell>
                                    <TableCell className="text-gray-300">
                                      {candidate.level}
                                    </TableCell>
                                    <TableCell className="text-gray-300">
                                      {candidate.rank}
                                    </TableCell>
                                    <TableCell>
                                      {status === "accepted" ||
                                      status === "interview" ||
                                      status === "hired" ? (
                                        <div className="flex flex-col gap-2">
                                          {candidate.candidate_links?.resume_link && (
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              className="bg-button-secondary-500/30 border-primary-500/30 text-white"
                                              asChild
                                            >
                                              <a
                                                href={
                                                  candidate.candidate_links
                                                    ?.resume_link
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                              >
                                                <FileText className="h-4 w-4 mr-1" />{" "}
                                                Resume
                                              </a>
                                            </Button>
                                          )}
                                          {candidate.candidate_links
                                            ?.linkedin_link && (
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              className="bg-button-secondary-500/30 border-primary-500/30 text-white"
                                              asChild
                                            >
                                              <a
                                                href={
                                                  candidate.candidate_links
                                                    ?.linkedin_link
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                              >
                                                <ExternalLink className="h-4 w-4 mr-1" />{" "}
                                                LinkedIn
                                              </a>
                                            </Button>
                                          )}
                                          {candidate.candidate_links
                                            ?.portfolio_link && (
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              className="bg-button-secondary-500/30 border-primary-500/30 text-white"
                                              asChild
                                            >
                                              <a
                                                href={
                                                  candidate.candidate_links
                                                    ?.portfolio_link
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                              >
                                                <ExternalLink className="h-4 w-4 mr-1" />{" "}
                                                Portfolio
                                              </a>
                                            </Button>
                                          )}
                                          {candidate.candidate_links
                                            ?.cover_letter && (
                                            <CoverLetterModal
                                              name={candidate.full_name}
                                              letter={
                                                candidate.candidate_links
                                                  ?.cover_letter || ""
                                              }
                                            />
                                          )}
                                          {candidate.candidate_links?.other_link && (
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              className="bg-button-secondary-500/30 border-primary-500/30 text-white"
                                              asChild
                                            >
                                              <a
                                                href={
                                                  candidate.candidate_links
                                                    ?.other_link
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                              >
                                                <ExternalLink className="h-4 w-4 mr-1" />{" "}
                                                Other Link
                                              </a>
                                            </Button>
                                          )}
                                        </div>
                                      ) : (
                                        <span className="text-gray-400">N/A</span>
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      {status === "no_invite" && (
                                        <Badge
                                          variant="outline"
                                          className="border-gray-500/30 text-gray-400"
                                        >
                                          No Invite
                                        </Badge>
                                      )}
                                      {status === "pending" && (
                                        <Badge
                                          variant="outline"
                                          className="border-yellow-500/30 text-yellow-400"
                                        >
                                          <Clock className="h-3 w-3 mr-1" /> Pending
                                        </Badge>
                                      )}
                                      {status === "accepted" && (
                                        <Badge
                                          variant="outline"
                                          className="border-green-500/30 text-green-400"
                                        >
                                          <CheckCircle className="h-3 w-3 mr-1" />{" "}
                                          Accepted
                                        </Badge>
                                      )}
                                      {status === "interview" && (
                                        <Badge
                                          variant="outline"
                                          className="border-blue-500/30 text-blue-400"
                                        >
                                          <Calendar className="h-3 w-3 mr-1" />{" "}
                                          Interviewing
                                        </Badge>
                                      )}
                                      {status === "hired" && (
                                        <Badge
                                          variant="outline"
                                          className="border-purple-500/30 text-purple-400"
                                        >
                                          <Briefcase className="h-3 w-3 mr-1" /> Hired
                                        </Badge>
                                      )}
                                      {status === "rejected" && (
                                        <Badge
                                          variant="outline"
                                          className="border-red-500/30 text-red-400"
                                        >
                                          <X className="h-3 w-3 mr-1" /> Rejected
                                        </Badge>
                                      )}
                                    </TableCell>
                                    {showActions && (
                                      <TableCell>
                                        <div className="flex gap-2 items-center">
                                          {status === "no_invite" && (
                                            <Button
                                              size="sm"
                                              className="bg-primary-500 hover:bg-primary-600"
                                              onClick={() =>
                                                handleSendInvite(
                                                  candidate,
                                                  selectedJobOffer
                                                )
                                              }
                                              disabled={
                                                sendJobInvitationsMutation.isPending
                                              }
                                            >
                                              {sendJobInvitationsMutation.isPending
                                                ? "Sending..."
                                                : "Send Invite"}
                                            </Button>
                                          )}

                                          {status === "accepted" && hireRequest && (
                                            <Button
                                              size="sm"
                                              className="bg-blue-500 hover:bg-blue-600"
                                              onClick={() =>
                                                handleScheduleInterviewClick(
                                                  hireRequest.id
                                                )
                                              }
                                              disabled={!candidate.application_id}
                                            >
                                              <Calendar className="h-4 w-4 mr-1" />{" "}
                                              Schedule Interview
                                            </Button>
                                          )}
                                          {status === "interview" && hireRequest && (
                                            <Button
                                              size="sm"
                                              className="bg-purple-500 hover:bg-purple-600"
                                              onClick={() =>
                                                handleHireCandidateClick(
                                                  hireRequest.id,
                                                  candidate.application_id!
                                                )
                                              }
                                              disabled={!candidate.application_id}
                                            >
                                              <Briefcase className="h-4 w-4 mr-1" />{" "}
                                              Mark as Hired
                                            </Button>
                                          )}
                                        </div>
                                      </TableCell>
                                    )}
                                  </TableRow>
                                );
                              }
                            )}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Mobile Card View - Visible only on mobile and tablet */}
                      <div className="lg:hidden space-y-4">
                        {eligibleCandidatesData.response.data.map(
                          (candidate: Candidate) => (
                            <CandidateCard
                              key={candidate.id}
                              candidate={candidate}
                            />
                          )
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <DialogFooter className="flex-shrink-0 px-4 sm:px-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-button-secondary-500/30 border-primary-500/30 text-white w-full sm:w-auto"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};