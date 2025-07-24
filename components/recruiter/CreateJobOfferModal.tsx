import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JobOffer, InterestGroup } from "@/types/recruiter";
import { UseMutationResult } from "@tanstack/react-query";

interface CreateJobOfferModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newJobOffer: JobOffer;
  setNewJobOffer: React.Dispatch<React.SetStateAction<JobOffer>>;
  interestGroups: InterestGroup[];
  isInterestGroupsLoading: boolean;
  interestGroupsError: string | null;
  addJobMutation: UseMutationResult<void, Error, any, unknown>;
  companyId: string | undefined;
  userId: string;
  queryClient: any;
}

export const CreateJobOfferModal: React.FC<CreateJobOfferModalProps> = ({
  isOpen,
  onOpenChange,
  newJobOffer,
  setNewJobOffer,
  interestGroups,
  isInterestGroupsLoading,
  interestGroupsError,
  addJobMutation,
  companyId,
  userId,
  queryClient,
}) => {
  const handleJobOfferChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewJobOffer((prev) => ({
      ...prev,
      [name]: name === "minKarma" ? parseInt(value) || 0 : value,
    }));
  };

  const handleJobTypeChange = (value: string) => {
    setNewJobOffer((prev) => ({
      ...prev,
      jobType: value as JobOffer["jobType"],
    }));
  };

  const handleOpeningTypeChange = (value: string) => {
    setNewJobOffer((prev) => ({
      ...prev,
      openingType: value as JobOffer["openingType"],
      task_id: value === "General" ? null : prev.task_id || null,
      task_description:
        value === "General" ? null : prev.task_description || "",
      task_hashtag: value === "General" ? null : prev.task_hashtag || null,
      task_verified: value === "General" ? null : prev.task_verified || false,
    }));
  };

  const handleTaskChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof JobOffer
  ) => {
    setNewJobOffer((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleInterestGroupsChange = (selectedGroup: string) => {
    setNewJobOffer((prev) => ({ ...prev, interestGroups: selectedGroup }));
  };

  const handleCreateSubmit = async () => {
    try {
      const addJobDto = {
        company_id: companyId,
        recruiter: userId,
        title: newJobOffer.title,
        skills: newJobOffer.skills || "",
        experience: newJobOffer.experience || "",
        domain: newJobOffer.interestGroups || "",
        location: newJobOffer.location || "",
        salary_range: newJobOffer.salaryRange || "",
        job_type: newJobOffer.jobType || "",
        minimum_karma: newJobOffer.minKarma,
        interest_groups: newJobOffer.interestGroups,
        opening_type: newJobOffer.openingType || "",
        task_description: newJobOffer.task_description || "",
        // task_hashtag: newJobOffer.task_hashtag || "",
      };

      await addJobMutation.mutateAsync(addJobDto);
      queryClient.invalidateQueries({ queryKey: ["job-offers", companyId] });
      setNewJobOffer({
        id: "",
        title: "",
        company_id: companyId || "",
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
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create job offer:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-secondary-800/50 backdrop-blur-md border border-primary-500/20 text-white">
        <DialogHeader>
          <DialogTitle>Create Job Offer</DialogTitle>
          <DialogDescription className="text-gray-400">
            Fill in the details to create a new job offer. Select an interest
            group.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={newJobOffer.title}
              onChange={handleJobOfferChange}
              placeholder="Enter job title"
              className="bg-secondary-700/50 border-primary-500/30 text-white"
              aria-required="true"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-2">
              <Label htmlFor="salaryRange">Salary Range</Label>
              <Input
                id="salaryRange"
                name="salaryRange"
                value={newJobOffer.salaryRange || ""}
                onChange={handleJobOfferChange}
                placeholder="$50,000 - $80,000"
                className="bg-secondary-700/50 border-primary-500/30 text-white"
              />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={newJobOffer.location || ""}
                onChange={handleJobOfferChange}
                placeholder="Enter location"
                className="bg-secondary-700/50 border-primary-500/30 text-white"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-2">
              <Label htmlFor="experience">Experience</Label>
              <Input
                id="experience"
                name="experience"
                value={newJobOffer.experience || ""}
                onChange={handleJobOfferChange}
                placeholder="e.g., 2-4 years"
                className="bg-secondary-700/50 border-primary-500/30 text-white"
              />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <Label htmlFor="jobType">Job Type</Label>
              <Select
                onValueChange={handleJobTypeChange}
                defaultValue={newJobOffer.jobType || undefined}
              >
                <SelectTrigger className="bg-secondary-700/50 border-primary-500/30 text-white">
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent className="bg-secondary-800 border-primary-500/30 text-white">
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="skills">Skills/Description</Label>
            <Textarea
              id="skills"
              name="skills"
              value={newJobOffer.skills || ""}
              onChange={handleJobOfferChange}
              placeholder="Enter job skills/description"
              className="bg-secondary-700/50 border-primary-500/30 text-white"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-2">
              <Label htmlFor="interestGroups">Interest Group</Label>
              <Select
                onValueChange={handleInterestGroupsChange}
                value={newJobOffer.interestGroups}
              >
                <SelectTrigger className="bg-secondary-700/50 border-primary-500/30 text-white">
                  <SelectValue
                    placeholder={
                      isInterestGroupsLoading
                        ? "Loading interest groups..."
                        : interestGroupsError
                        ? "Error loading interest groups"
                        : "Select interest group"
                    }
                  />
                </SelectTrigger>
                <SelectContent className="bg-secondary-800 border-primary-500/30 text-white">
                  {isInterestGroupsLoading ? (
                    <SelectItem value="loading" disabled>
                      Loading...
                    </SelectItem>
                  ) : interestGroupsError ? (
                    <SelectItem value="error" disabled>
                      Error: {interestGroupsError}
                    </SelectItem>
                  ) : (
                    interestGroups.map((group) => (
                      <SelectItem key={group.id} value={group.name}>
                        {group.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <Label htmlFor="minKarma">Minimum Karma</Label>
              <Input
                id="minKarma"
                name="minKarma"
                type="number"
                value={newJobOffer.minKarma}
                onChange={handleJobOfferChange}
                placeholder="e.g., 500"
                className="bg-secondary-700/50 border-primary-500/30 text-white"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="openingType">Opening Type</Label>
            <Select
              onValueChange={handleOpeningTypeChange}
              defaultValue={newJobOffer.openingType || "General"}
            >
              <SelectTrigger className="bg-secondary-700/50 border-primary-500/30 text-white">
                <SelectValue
                  placeholder="Select opening type"
                />
              </SelectTrigger>
              <SelectContent className="bg-secondary-800 border-primary-500/30 text-white">
                <SelectItem value="General">General</SelectItem>
                {/* <SelectItem value="Task">Task</SelectItem> */}
              </SelectContent>
            </Select>
          </div>

          {newJobOffer.openingType === "Task" && (
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-medium text-white">Task</h3>
              <div className="flex flex-col gap-2">
                <Label htmlFor="task_description">Task Description</Label>
                <Textarea
                  id="task_description"
                  name="task_description"
                  value={newJobOffer.task_description || ""}
                  onChange={(e) => handleTaskChange(e, "task_description")}
                  placeholder="Enter task description"
                  className="bg-secondary-700/50 border-primary-500/30 text-white"
                  aria-required="true"
                />
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-button-secondary-500/30 border-primary-500/30 text-white"
            aria-label="Cancel job offer creation"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateSubmit}
            disabled={
              !newJobOffer.title.trim() ||
              !newJobOffer.interestGroups.trim() ||
              (newJobOffer.openingType === "Task" &&
                !newJobOffer.task_description?.trim())
            }
            className="bg-primary-500 hover:bg-primary-600"
            aria-label="Create job offer"
          >
            Create Offer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
