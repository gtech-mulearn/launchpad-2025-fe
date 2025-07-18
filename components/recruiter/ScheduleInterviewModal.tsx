import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useScheduleInterview } from "@/hooks/recuiter";
import { InterviewDetails } from "@/types/recruiter";

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onScheduleSubmit: (details: InterviewDetails) => void;
  accessToken: string;
  applicationId: string;
}

export const ScheduleInterviewModal: React.FC<ScheduleInterviewModalProps> = ({
  isOpen,
  onOpenChange,
  onScheduleSubmit,
  accessToken,
  applicationId,
}) => {
  const [interviewDetails, setInterviewDetails] = useState<InterviewDetails>({
    application_id: applicationId,
    interview_date: "",
    interview_time: "",
    interview_platform: "",
    interview_link: "",
  });
  const scheduleInterviewMutation = useScheduleInterview(accessToken);

  // Debug logging
  console.log("applicationId in ScheduleInterviewModal:", applicationId);
  console.log("Initial interviewDetails:", interviewDetails);

  // Sync applicationId with state if it changes
  useEffect(() => {
    setInterviewDetails((prev) => {
      if (prev.application_id !== applicationId) {
        console.log("Updating interviewDetails.application_id to:", applicationId);
        return { ...prev, application_id: applicationId };
      }
      return prev;
    });
  }, [applicationId]);

  const handleScheduleSubmit = () => {
    if (!interviewDetails.application_id) {
      console.error("Cannot schedule interview: application_id is missing");
      return;
    }

    console.log("Submitting interviewDetails:", interviewDetails); // Debug
    scheduleInterviewMutation.mutate(
      {
        application_id: interviewDetails.application_id,
        interview_date: interviewDetails.interview_date,
        interview_time: interviewDetails.interview_time,
        interview_platform: interviewDetails.interview_platform,
        interview_link: interviewDetails.interview_link,
      },
      {
        onSuccess: () => {
          console.log("Interview scheduled successfully:", interviewDetails);
          onScheduleSubmit(interviewDetails);
          setInterviewDetails({
            application_id: applicationId,
            interview_date: "",
            interview_time: "",
            interview_platform: "",
            interview_link: "",
          });
          onOpenChange(false);
        },
        onError: (error) => {
          console.error("Error scheduling interview:", error);
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-secondary-800/50 backdrop-blur-md border border-primary-500/30 text-white">
        <DialogHeader>
          <DialogTitle>Schedule Interview</DialogTitle>
          <DialogDescription className="text-gray-400">
            Set the interview details for the candidate.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="interviewDate">Interview Date</Label>
            <Input
              id="interviewDate"
              type="date"
              value={interviewDetails.interview_date}
              onChange={(e) =>
                setInterviewDetails((prev) => {
                  const updated = { ...prev, interview_date: e.target.value };
                  console.log("Updated interview_date:", updated);
                  return updated;
                })
              }
              className="bg-secondary-700/50 border-primary-500/30 text-white"
              aria-required="true"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="interviewTime">Interview Time</Label>
            <Input
              id="interviewTime"
              type="time"
              value={interviewDetails.interview_time}
              onChange={(e) =>
                setInterviewDetails((prev) => {
                  const updated = { ...prev, interview_time: e.target.value };
                  console.log("Updated interview_time:", updated);
                  return updated;
                })
              }
              className="bg-secondary-700/50 border-primary-500/30 text-white"
              aria-required="true"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="interviewPlatform">Interview Platform</Label>
            <Select
              onValueChange={(value) =>
                setInterviewDetails((prev) => {
                  const updated = { ...prev, interview_platform: value };
                  console.log("Updated interview_platform:", updated);
                  return updated;
                })
              }
              value={interviewDetails.interview_platform}
            >
              <SelectTrigger className="bg-secondary-700/50 border-primary-500/30 text-white">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent className="bg-secondary-800 border-primary-500/30 text-white">
                <SelectItem value="Zoom">Zoom</SelectItem>
                <SelectItem value="Google Meet">Google Meet</SelectItem>
                <SelectItem value="Microsoft Teams">Microsoft Teams</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="interviewLink">Interview Link</Label>
            <Input
              id="interviewLink"
              value={interviewDetails.interview_link}
              onChange={(e) =>
                setInterviewDetails((prev) => {
                  const updated = { ...prev, interview_link: e.target.value };
                  console.log("Updated interview_link:", updated);
                  return updated;
                })
              }
              placeholder="Enter interview link"
              className="bg-secondary-700/50 border-primary-500/30 text-white"
              aria-required="true"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-button-secondary-500/30 border-primary-500/30 text-white"
            aria-label="Cancel interview scheduling"
          >
            Cancel
          </Button>
          <Button
            onClick={handleScheduleSubmit}
            disabled={
              !interviewDetails.interview_date ||
              !interviewDetails.interview_time ||
              !interviewDetails.interview_platform ||
              !interviewDetails.interview_link ||
              !interviewDetails.application_id ||
              scheduleInterviewMutation.isPending
            }
            className="bg-primary-500 hover:bg-primary-600"
            aria-label="Schedule interview"
          >
            {scheduleInterviewMutation.isPending ? "Scheduling..." : "Schedule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};