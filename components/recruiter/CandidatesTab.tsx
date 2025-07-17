import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table,  TableBody, TableCell, TableHead, TableRow, TableHeader } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Eye, MessageSquare } from "lucide-react";
import { Candidate } from "@/types/recruiter";

interface CandidatesTabProps {
  candidates: Candidate[];
}

export const CandidatesTab: React.FC<CandidatesTabProps> = ({ candidates }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCandidates = useMemo(() => {
    return candidates.filter(
      (candidate) =>
        candidate.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.interest_groups.some((ig) =>
          ig.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  }, [candidates, searchQuery]);

  return (
    <Card className="bg-secondary-800/50 backdrop-blur-md border border-primary-500/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Candidate Database</CardTitle>
            <CardDescription className="text-gray-400">
              Browse and filter available candidates
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search candidates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary-700/50 border-primary-500/30 text-white"
                aria-label="Search candidates"
              />
            </div>
            <Button
              size="sm"
              className="bg-primary-500 hover:bg-primary-600"
              aria-label="Filter candidates"
            >
              <Filter className="h-4 w-4 mr-1" />
              Filter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700">
              <TableHead className="text-gray-300">Candidate</TableHead>
              <TableHead className="text-gray-300">Interest Groups</TableHead>
              <TableHead className="text-gray-300">College</TableHead>
              <TableHead className="text-gray-300">Karma</TableHead>
              <TableHead className="text-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCandidates.map((candidate) => (
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
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-button-secondary-500/30 border-primary-500/30 text-white"
                      aria-label={`View ${candidate.full_name}'s profile`}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      className="bg-primary-500 hover:bg-primary-600"
                      aria-label={`Contact ${candidate.full_name}`}
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
  );
};