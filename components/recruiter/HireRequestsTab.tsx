import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, XCircle, Calendar, Briefcase } from "lucide-react";
import { JobInvite } from "@/types/recruiter";

interface HireRequestsTabProps {
  hireRequests: JobInvite[];
  onViewJobDetails: (jobId: string) => void;
}

export const HireRequestsTab: React.FC<HireRequestsTabProps> = ({ hireRequests, onViewJobDetails }) => {
  return (
    <Card className="bg-secondary-800/50 backdrop-blur-md border border-primary-500/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Hire Requests</CardTitle>
            <CardDescription className="text-gray-400">
              Track your hiring requests and their status
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {hireRequests.length === 0 ? (
          <div className="text-gray-400 text-center">No hire requests found.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Candidate</TableHead>
                <TableHead className="text-gray-300">Title</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Sent Date</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hireRequests.map((request) => (
                <TableRow key={request.id} className="border-gray-700">
                  <TableCell className="text-white font-medium">{request.candidateName}</TableCell>
                  <TableCell className="text-gray-300">{request.title}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        request.status === "accepted"
                          ? "border-green-500/30 text-green-400"
                          : request.status === "rejected"
                          ? "border-red-500/30 text-red-400"
                          : request.status === "interview"
                          ? "border-blue-500/30 text-blue-400"
                          : request.status === "hired"
                          ? "border-purple-500/30 text-purple-400"
                          : "border-yellow-500/30 text-yellow-400"
                      }
                    >
                      {request.status === "accepted" && <CheckCircle className="h-3 w-3 mr-1" />}
                      {request.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                      {request.status === "rejected" && <XCircle className="h-3 w-3 mr-1" />}
                      {request.status === "interview" && <Calendar className="h-3 w-3 mr-1" />}
                      {request.status === "hired" && <Briefcase className="h-3 w-3 mr-1" />}
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-300">{request.sentDate}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      className="bg-primary-500 hover:bg-primary-600"
                      onClick={() => onViewJobDetails(request.jobId!)}
                      aria-label={`View details of ${request.candidateName}'s hire request`}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};