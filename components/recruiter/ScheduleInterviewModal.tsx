import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface InterviewDetails {
  interviewDate: string;
  interviewTime: string;
  interviewPlatform: string;
  interviewLink: string;
}

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onScheduleSubmit: (details: InterviewDetails) => void;
}

export const ScheduleInterviewModal: React.FC<ScheduleInterviewModalProps> = ({
  isOpen,
  onOpenChange,
  onScheduleSubmit,
}) => {
  const [interviewDetails, setInterviewDetails] = useState<InterviewDetails>({
    interviewDate: "",
    interviewTime: "",
    interviewPlatform: "",
    interviewLink: "",
  });

  const handleScheduleSubmit = () => {
    onScheduleSubmit(interviewDetails);
    setInterviewDetails({
      interviewDate: "",
      interviewTime: "",
      interviewPlatform: "",
      interviewLink: "",
    });
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
              value={interviewDetails.interviewDate}
              onChange={(e) =>
                setInterviewDetails((prev) => ({ ...prev, interviewDate: e.target.value }))
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
              value={interviewDetails.interviewTime}
              onChange={(e) =>
                setInterviewDetails((prev) => ({ ...prev, interviewTime: e.target.value }))
              }
              className="bg-secondary-700/50 border-primary-500/30 text-white"
              aria-required="true"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="interviewPlatform">Interview Platform</Label>
            <Select
              onValueChange={(value) =>
                setInterviewDetails((prev) => ({ ...prev, interviewPlatform: value }))
              }
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
              value={interviewDetails.interviewLink}
              onChange={(e) =>
                setInterviewDetails((prev) => ({ ...prev, interviewLink: e.target.value }))
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
              !interviewDetails.interviewDate ||
              !interviewDetails.interviewTime ||
              !interviewDetails.interviewPlatform ||
              !interviewDetails.interviewLink
            }
            className="bg-primary-500 hover:bg-primary-600"
            aria-label="Schedule interview"
          >
            Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};