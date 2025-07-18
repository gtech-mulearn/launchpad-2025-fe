import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Eye, MessageSquare } from "lucide-react";
import { Candidate } from "@/types/recruiter";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CandidatesTabProps {
  candidates: Candidate[];
  onViewCandidate: (candidate: Candidate) => void;
}

interface FilterState {
  interestGroup: string;
  college: string;
  minKarma: string;
  maxKarma: string;
  level: string;
}

export const CandidatesTab: React.FC<CandidatesTabProps> = ({ candidates, onViewCandidate }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    interestGroup: "",
    college: "",
    minKarma: "",
    maxKarma: "",
    level: "",
  });

  const uniqueInterestGroups = useMemo(
    () => Array.from(new Set(candidates.flatMap((c) => c.interest_groups.map((ig) => ig.name)))).sort(),
    [candidates]
  );
  const uniqueColleges = useMemo(
    () => Array.from(new Set(candidates.map((c) => c.college_name))).sort(),
    [candidates]
  );
  const uniqueLevels = useMemo(
    () => Array.from(new Set(candidates.map((c) => c.level))).sort(),
    [candidates]
  );

  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const matchesSearch =
        candidate.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.interest_groups.some((ig) =>
          ig.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesInterestGroup =
        !filters.interestGroup ||
        candidate.interest_groups.some((ig) => ig.name === filters.interestGroup);

      const matchesCollege = !filters.college || candidate.college_name === filters.college;

      const minKarma = filters.minKarma ? parseInt(filters.minKarma, 10) : -Infinity;
      const maxKarma = filters.maxKarma ? parseInt(filters.maxKarma, 10) : Infinity;
      const matchesKarma = candidate.karma >= minKarma && candidate.karma <= maxKarma;

      const matchesLevel = !filters.level || candidate.level === filters.level;

      return matchesSearch && matchesInterestGroup && matchesCollege && matchesKarma && matchesLevel;
    });
  }, [candidates, searchQuery, filters]);

  const handleContact = (email: string) => {
    const subject = encodeURIComponent("Job Opportunity Inquiry");
    const body = encodeURIComponent(
      `Dear ${email.split("@")[0]},\n\nWe are reaching out regarding a potential job opportunity that matches your profile. Please let us know your availability to discuss further.\n\nBest regards,\n[Your Name]`
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  const resetFilters = () => {
    setFilters({
      interestGroup: "",
      college: "",
      minKarma: "",
      maxKarma: "",
      level: "",
    });
  };

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
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  size="sm"
                  className="bg-primary-500 hover:bg-primary-600"
                  aria-label="Filter candidates"
                >
                  <Filter className="h-4 w-4 mr-1" />
                  Filter
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-secondary-800/50 backdrop-blur-md border border-primary-500/20 text-white">
                <div className="grid gap-4">
                  <div>
                    <Label className="text-gray-300">Interest Group</Label>
                    <Select
                      value={filters.interestGroup}
                      onValueChange={(value) =>
                        setFilters((prev) => ({ ...prev, interestGroup: value }))
                      }
                    >
                      <SelectTrigger className="bg-secondary-700/50 border-primary-500/30 text-white">
                        <SelectValue placeholder="Select interest group" />
                      </SelectTrigger>
                      <SelectContent className="bg-secondary-700/50 border-primary-500/30 text-white">
                        <SelectItem value="">All</SelectItem>
                        {uniqueInterestGroups.map((ig) => (
                          <SelectItem key={ig} value={ig}>
                            {ig}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-300">College</Label>
                    <Select
                      value={filters.college}
                      onValueChange={(value) => setFilters((prev) => ({ ...prev, college: value }))}
                    >
                      <SelectTrigger className="bg-secondary-700/50 border-primary-500/30 text-white">
                        <SelectValue placeholder="Select college" />
                      </SelectTrigger>
                      <SelectContent className="bg-secondary-700/50 border-primary-500/30 text-white">
                        <SelectItem value="">All</SelectItem>
                        {uniqueColleges.map((college) => (
                          <SelectItem key={college} value={college}>
                            {college}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-300">Karma Range</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={filters.minKarma}
                        onChange={(e) =>
                          setFilters((prev) => ({ ...prev, minKarma: e.target.value }))
                        }
                        className="bg-secondary-700/50 border-primary-500/30 text-white"
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={filters.maxKarma}
                        onChange={(e) =>
                          setFilters((prev) => ({ ...prev, maxKarma: e.target.value }))
                        }
                        className="bg-secondary-700/50 border-primary-500/30 text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-300">Level</Label>
                    <Select
                      value={filters.level}
                      onValueChange={(value) => setFilters((prev) => ({ ...prev, level: value }))}
                    >
                      <SelectTrigger className="bg-secondary-700/50 border-primary-500/30 text-white">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent className="bg-secondary-700/50 border-primary-500/30 text-white">
                        <SelectItem value="">All</SelectItem>
                        {uniqueLevels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant="outline"
                    className="bg-button-secondary-500/30 border-primary-500/30 text-white"
                    onClick={resetFilters}
                  >
                    Reset Filters
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredCandidates.length === 0 ? (
          <div className="text-gray-400 text-center">No candidates found.</div>
        ) : (
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
                        onClick={() => onViewCandidate(candidate)}
                        aria-label={`View ${candidate.full_name}'s profile`}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        className="bg-primary-500 hover:bg-primary-600"
                        onClick={() => handleContact(candidate.email)}
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
        )}
      </CardContent>
    </Card>
  );
};