import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Candidate } from "@/types/recruiter";
import { ExternalLink } from "lucide-react";

interface CandidateDetailsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: Candidate | null;
}

export const CandidateDetailsModal: React.FC<CandidateDetailsModalProps> = ({
  isOpen,
  onOpenChange,
  candidate,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[95vw] sm:max-w-[90vw] max-h-[80vh] overflow-y-scroll md:max-w-3xl lg:max-w-4xl bg-secondary-800/50 backdrop-blur-md border border-primary-500/20 text-white p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl md:text-2xl">{candidate?.full_name} - Candidate Profile</DialogTitle>
          <DialogDescription className="text-gray-400 text-sm sm:text-base">
            Detailed information about the candidate.
          </DialogDescription>
        </DialogHeader>
        {candidate && (
          <div className="flex flex-col gap-4 sm:gap-6">
            <Card className="bg-secondary-700/50 border-primary-500/30">
              <CardHeader>
                <CardTitle className="text-white text-base sm:text-lg md:text-xl">Candidate Information</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-400 font-medium text-sm sm:text-base">Full Name</p>
                    <p className="text-white text-sm sm:text-base">{candidate.full_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-medium text-sm sm:text-base">Email</p>
                    <p className="text-white text-sm sm:text-base break-all">{candidate.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-medium text-sm sm:text-base">College</p>
                    <p className="text-white text-sm sm:text-base">{candidate.college_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-medium text-sm sm:text-base">Karma</p>
                    <p className="text-white text-sm sm:text-base">{candidate.karma}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-medium text-sm sm:text-base">Level</p>
                    <p className="text-white text-sm sm:text-base">{candidate.level}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-medium text-sm sm:text-base">Rank</p>
                    <p className="text-white text-sm sm:text-base">{candidate.rank}</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 font-medium text-sm sm:text-base">Interest Groups</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {candidate.interest_groups.map((ig, index) => (
                      <Badge key={index} variant="outline" className="text-xs sm:text-sm border-primary-500/30 text-primary-400">
                        {ig.name}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 font-medium text-sm sm:text-base">Roles</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {candidate.roles.map((role, index) => (
                      <Badge key={index} variant="outline" className="text-xs sm:text-sm border-primary-500/30 text-primary-400">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 font-medium text-sm sm:text-base">Karma Distribution</p>
                  <div className="grid gap-2 mt-2">
                    {candidate.karma_distribution.map((dist, index) => (
                      <div key={index} className="text-white text-sm sm:text-base">
                        {dist.task_type}: {dist.karma} points
                      </div>
                    ))}
                  </div>
                </div>
                {candidate.muid && (
                  <div>
                    <p className="text-gray-400 font-medium text-sm sm:text-base">MuID Profile</p>
                    <Button size="sm" variant="outline" className="bg-button-secondary-500/30 border-primary-500/30 text-white mt-2 text-xs sm:text-sm" asChild>
                      <a href={`https://mulearn.org/${candidate.muid}`} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> View MuID Profile
                      </a>
                    </Button>
                  </div>
                )}
                {candidate.application_details && (
                  <div className="border-t border-primary-500/20 pt-4">
                    <p className="text-gray-400 font-medium text-base sm:text-lg mb-2">Application Details</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {candidate.application_details.resume_link && (
                        <Button size="sm" variant="outline" className="bg-button-secondary-500/30 border-primary-500/30 text-white text-xs sm:text-sm" asChild>
                          <a href={candidate.application_details.resume_link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Resume
                          </a>
                        </Button>
                      )}
                      {candidate.application_details.linkedin_link && (
                        <Button size="sm" variant="outline" className="bg-button-secondary-500/30 border-primary-500/30 text-white text-xs sm:text-sm" asChild>
                          <a href={candidate.application_details.linkedin_link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> LinkedIn
                          </a>
                        </Button>
                      )}
                      {candidate.application_details.portfolio_link && (
                        <Button size="sm" variant="outline" className="bg-button-secondary-500/30 border-primary-500/30 text-white text-xs sm:text-sm" asChild>
                          <a href={candidate.application_details.portfolio_link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Portfolio
                          </a>
                        </Button>
                      )}
                      {candidate.application_details.cover_letter && (
                        <Button size="sm" variant="outline" className="bg-button-secondary-500/30 border-primary-500/30 text-white text-xs sm:text-sm" asChild>
                          <a href={candidate.application_details.cover_letter} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Cover Letter
                          </a>
                        </Button>
                      )}
                      {candidate.application_details.other_link && (
                        <Button size="sm" variant="outline" className="bg-button-secondary-500/30 border-primary-500/30 text-white text-xs sm:text-sm" asChild>
                          <a href={candidate.application_details.other_link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Other Link
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
        <DialogFooter className="mt-4 sm:mt-6">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            className="bg-button-secondary-500/30 border-primary-500/30 text-white text-xs sm:text-sm px-3 sm:px-4"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};