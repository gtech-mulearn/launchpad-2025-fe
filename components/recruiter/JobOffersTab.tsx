import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { JobOffer } from "@/types/recruiter";

interface JobOffersTabProps {
  jobOffers: JobOffer[] | undefined;
  isLoading: boolean;
  error: Error | null;
  onCreateJobOffer: () => void;
  onViewDetails: (offer: JobOffer) => void;
}

export const JobOffersTab: React.FC<JobOffersTabProps> = ({
  jobOffers,
  isLoading,
  error,
  onCreateJobOffer,
  onViewDetails,
}) => {
  return (
    <Card className="bg-secondary-800/50 backdrop-blur-md border border-primary-500/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Job Offers</CardTitle>
            <CardDescription className="text-gray-400">Manage your job offers</CardDescription>
          </div>
          <Button
            size="sm"
            className="bg-primary-500 hover:bg-primary-600"
            onClick={onCreateJobOffer}
            aria-label="Create new job offer"
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            Create Job Offer
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-gray-400 text-center">Loading job offers...</div>
        ) : error ? (
          <div className="text-red-400 text-center">Error: {error.message}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Title</TableHead>
                <TableHead className="text-gray-300">Location</TableHead>
                <TableHead className="text-gray-300">Job Type</TableHead>
                <TableHead className="text-gray-300">Job Type</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobOffers && jobOffers.length > 0 ? (
                jobOffers.map((offer) => (
                  <TableRow key={offer.id} className="border-gray-700">
                    <TableCell className="text-white font-medium">{offer.title}</TableCell>
                    <TableCell className="text-gray-300">{offer.location || "N/A"}</TableCell>
                    <TableCell className="text-gray-300">
                      {offer.jobType || "N/A"}
                    </TableCell>
                    <TableCell className="text-gray-300">{offer.jobType || "N/A"}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        className="bg-primary-500 hover:bg-primary-600"
                        onClick={() => onViewDetails(offer)}
                        aria-label={`View details of ${offer.title}`}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-gray-400 text-center">
                    No job offers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};