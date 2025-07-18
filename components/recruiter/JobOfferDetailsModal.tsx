import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Calendar, Briefcase, ExternalLink, Clock, FileText } from "lucide-react";
import { JobOffer, Candidate, JobInvite } from "@/types/recruiter";
import { useSendJobInvitations } from "@/hooks/recuiter";

interface JobOfferDetailsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedJobOffer: JobOffer | null;
  eligibleCandidatesData: any;
  isEligibleCandidatesLoading: boolean;
  eligibleCandidatesError: Error | null;
  hireRequests: JobInvite[];
  accessToken: string;
  onAcceptInvite: (inviteId: number) => void;
  onScheduleInterview: (inviteId: number) => void;
  onHireCandidate: (inviteId: number) => void;
  onInviteSent: (invite: JobInvite) => void;
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
  onAcceptInvite,
  onScheduleInterview,
  onHireCandidate,
  onInviteSent,
}) => {
  const sendJobInvitationsMutation = useSendJobInvitations(accessToken);

  const handleSendInvite = async (candidate: Candidate, offer: JobOffer) => {
    try {
      await sendJobInvitationsMutation.mutateAsync({
        jobId: offer.id,
        studentIds: [candidate.id],
      });

      const newInvite: JobInvite = {
        id: hireRequests.length + 1,
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
        sentDate: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        openingType: offer.openingType,
      };

      console.log("New invite created:", newInvite); // Debug
      onInviteSent(newInvite);
    } catch (error) {
      console.error("Failed to send invitation:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] h-[90vh] bg-secondary-800/50 backdrop-blur-md border border-primary-500/20 text-white overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{selectedJobOffer?.title} - Job Offer Details</DialogTitle>
          <DialogDescription className="text-gray-400">
            View job offer details and manage eligible candidates.
          </DialogDescription>
        </DialogHeader>
        {selectedJobOffer && (
          <div className="flex flex-col gap-6">
            <Card className="bg-secondary-700/50 border-primary-500/30">
              <CardHeader>
                <CardTitle className="text-white">Job Offer Information</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 font-medium">Title</p>
                    <p className="text-white">{selectedJobOffer.title}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-medium">Company ID</p>
                    <p className="text-white">{selectedJobOffer.company_id}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-medium">Salary Range</p>
                    <p className="text-white">{selectedJobOffer.salaryRange || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-medium">Location</p>
                    <p className="text-white">{selectedJobOffer.location || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-medium">Experience</p>
                    <p className="text-white">{selectedJobOffer.experience || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-medium">Job Type</p>
                    <p className="text-white">{selectedJobOffer.jobType || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-medium">Interest Group</p>
                    <p className="text-white">{selectedJobOffer.interestGroups || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-medium">Minimum Karma</p>
                    <p className="text-white">{selectedJobOffer.minKarma}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-medium">Opening Type</p>
                    <p className="text-white">{selectedJobOffer.openingType || "N/A"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 font-medium">Skills/Description</p>
                  <p className="text-white">{selectedJobOffer.skills || "N/A"}</p>
                </div>
                {selectedJobOffer.openingType === "Task" && (
                  <div className="border-t border-primary-500/20 pt-4">
                    <p className="text-gray-400 font-medium text-lg mb-2">Task Details</p>
                    <div className="grid gap-2">
                      <div>
                        <p className="text-gray-400 font-medium">Task ID</p>
                        <p className="text-white font-semibold">{selectedJobOffer.task_id || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 font-medium">Task Description</p>
                        <p className="text-white">{selectedJobOffer.task_description || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 font-medium">Task Hashtag</p>
                        <p className="text-white">{selectedJobOffer.task_hashtag || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 font-medium">Task Verified</p>
                        <p className="text-white">{selectedJobOffer.task_verified ? "Yes" : "No"}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="bg-secondary-700/50 border-primary-500/30">
              <CardHeader>
                <CardTitle className="text-white">Eligible Candidates</CardTitle>
                <CardDescription className="text-gray-400">
                  Candidates matching the job offer's requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isEligibleCandidatesLoading ? (
                  <div className="text-gray-400 text-center">Loading eligible candidates...</div>
                ) : eligibleCandidatesError ? (
                  <div className="text-red-400 text-center">Error: {eligibleCandidatesError.message}</div>
                ) : !eligibleCandidatesData?.response.data.length ? (
                  <div className="text-gray-400 text-center">No eligible candidates found.</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700">
                        <TableHead className="text-gray-300">Candidate</TableHead>
                        <TableHead className="text-gray-300">Interest Groups</TableHead>
                        <TableHead className="text-gray-300">College</TableHead>
                        <TableHead className="text-gray-300">Karma</TableHead>
                        <TableHead className="text-gray-300">Level</TableHead>
                        <TableHead className="text-gray-300">Rank</TableHead>
                        <TableHead className="text-gray-300">Application Details</TableHead>
                        <TableHead className="text-gray-300">Status/Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {eligibleCandidatesData.response.data.map((candidate: Candidate) => {
                        const invite = hireRequests.find(
                          (req) => req.candidateId === candidate.id && req.jobId === selectedJobOffer.id
                        );
                        const status = invite ? invite.status : "no_invite";

                        return (
                          <TableRow key={candidate.id} className="border-gray-700">
                            <TableCell>
                              <div>
                                <div className="font-medium text-white">{candidate.full_name}</div>
                                <div className="text-sm text-gray-400">{candidate.email}</div>
                              </div>
                            </TableCell>
                            <TableCell>
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
                            </TableCell>
                            <TableCell className="text-gray-300">{candidate.college_name}</TableCell>
                            <TableCell className="text-gray-300">{candidate.karma}</TableCell>
                            <TableCell className="text-gray-300">{candidate.level}</TableCell>
                            <TableCell className="text-gray-300">{candidate.rank}</TableCell>
                            <TableCell>
                              {status === "accepted" || status === "interview" ? (
                                <div className="flex flex-col gap-2">
                                  {invite?.resume_link && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="bg-button-secondary-500/30 border-primary-500/30 text-white"
                                      asChild
                                      aria-label={`View resume of ${candidate.full_name}`}
                                    >
                                      <a href={invite.resume_link} target="_blank" rel="noopener noreferrer">
                                        <FileText className="h-4 w-4 mr-1" />
                                        Resume
                                      </a>
                                    </Button>
                                  )}
                                  {invite?.linkedin_link && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="bg-button-secondary-500/30 border-primary-500/30 text-white"
                                      asChild
                                      aria-label={`View LinkedIn of ${candidate.full_name}`}
                                    >
                                      <a href={invite.linkedin_link} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="h-4 w-4 mr-1" />
                                        LinkedIn
                                      </a>
                                    </Button>
                                  )}
                                  {invite?.portfolio_link && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="bg-button-secondary-500/30 border-primary-500/30 text-white"
                                      asChild
                                      aria-label={`View portfolio of ${candidate.full_name}`}
                                    >
                                      <a href={invite.portfolio_link} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="h-4 w-4 mr-1" />
                                        Portfolio
                                      </a>
                                    </Button>
                                  )}
                                  {invite?.cover_letter && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="bg-button-secondary-500/30 border-primary-500/30 text-white"
                                      asChild
                                      aria-label={`View cover letter of ${candidate.full_name}`}
                                    >
                                      <a href={invite.cover_letter} target="_blank" rel="noopener noreferrer">
                                        <FileText className="h-4 w-4 mr-1" />
                                        Cover Letter
                                      </a>
                                    </Button>
                                  )}
                                  {invite?.other_link && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="bg-button-secondary-500/30 border-primary-500/30 text-white"
                                      asChild
                                      aria-label={`View other link of ${candidate.full_name}`}
                                    >
                                      <a href={invite.other_link} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="h-4 w-4 mr-1" />
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
                              <div className="flex gap-2 items-center">
                                {status === "no_invite" && (
                                  <Button
                                    size="sm"
                                    className="bg-primary-500 hover:bg-primary-600"
                                    onClick={() => handleSendInvite(candidate, selectedJobOffer)}
                                    disabled={sendJobInvitationsMutation.isPending}
                                    aria-label={`Send invite to ${candidate.full_name}`}
                                  >
                                    {sendJobInvitationsMutation.isPending ? "Sending..." : "Send Invite"}
                                  </Button>
                                )}
                                {status === "pending" && (
                                  <Badge variant="outline" className="border-yellow-500/30 text-yellow-400">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Pending
                                  </Badge>
                                )}
                                {status === "accepted" && invite && (
                                  <>
                                    <Badge variant="outline" className="border-green-500/30 text-green-400">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Accepted
                                    </Badge>
                                    {candidate.muid && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="bg-button-secondary-500/30 border-primary-500/30 text-white"
                                        asChild
                                        aria-label={`View MUID of ${candidate.full_name}`}
                                      >
                                        <a href={`https://mulearn.org/${candidate.muid}`} target="_blank" rel="noopener noreferrer">
                                          <ExternalLink className="h-4 w-4 mr-1" />
                                          MUID
                                        </a>
                                      </Button>
                                    )}
                                    <Button
                                      size="sm"
                                      className="bg-blue-500 hover:bg-blue-600"
                                      onClick={() => onScheduleInterview(invite.id)}
                                      disabled={!invite.application_id}
                                      aria-label={`Schedule interview for ${candidate.full_name}`}
                                    >
                                      <Calendar className="h-4 w-4 mr-1" />
                                      Schedule Interview
                                    </Button>
                                  </>
                                )}
                                {status === "interview" && invite && (
                                  <>
                                    <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                                      <Calendar className="h-3 w-3 mr-1" />
                                      Interview Scheduled
                                    </Badge>
                                    <Button
                                      size="sm"
                                      className="bg-purple-500 hover:bg-purple-600"
                                      onClick={() => onHireCandidate(invite.id)}
                                      aria-label={`Mark ${candidate.full_name} as hired`}
                                    >
                                      <Briefcase className="h-4 w-4 mr-1" />
                                      Mark as Hired
                                    </Button>
                                  </>
                                )}
                                {status === "hired" && (
                                  <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                                    <Briefcase className="h-3 w-3 mr-1" />
                                    Hired
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        )}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-button-secondary-500/30 border-primary-500/30 text-white"
            aria-label="Close job offer details"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};