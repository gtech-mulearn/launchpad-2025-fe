"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  Briefcase,
  Calendar,
  TrendingUp,
  LogOut,
  Search,
  Filter,
  Eye,
  MessageSquare,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { useLocalStorage } from "@/hooks/misc";
import { useGetRecruiter } from "@/hooks/auth";

// Mock data for demonstration
const mockCandidates = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    skills: ["React", "Node.js", "TypeScript"],
    experience: "3 years",
    availability: "Available",
    status: "Active",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    skills: ["Python", "Django", "PostgreSQL"],
    experience: "5 years",
    availability: "Available",
    status: "Active",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    skills: ["Java", "Spring Boot", "AWS"],
    experience: "4 years",
    availability: "Busy",
    status: "Active",
  },
];

const mockHireRequests = [
  {
    id: "1",
    candidateName: "John Doe",
    position: "Frontend Developer",
    status: "Pending",
    sentDate: "2024-01-15",
    company: "Tech Corp",
  },
  {
    id: "2",
    candidateName: "Jane Smith",
    position: "Backend Developer",
    status: "Accepted",
    sentDate: "2024-01-14",
    company: "Tech Corp",
  },
  {
    id: "3",
    candidateName: "Mike Johnson",
    position: "Full Stack Developer",
    status: "Rejected",
    sentDate: "2024-01-13",
    company: "Tech Corp",
  },
];

export default function RecruiterDashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [accessToken] = useLocalStorage("accessToken", "");
  const [userId] = useLocalStorage("userId", "");
  const recruiter = useGetRecruiter(userId, accessToken);
  if (recruiter.isLoading) return null;
  if (!recruiter.data) {
    router.push("/login");
    return null;
  }
  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");

    // Force a page reload to clear any cached state
    window.location.href = "/login";
  };

  const filteredCandidates = mockCandidates.filter(
    (candidate) =>
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.skills.some((skill) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Recruiter Dashboard
            </h1>
            <p className="text-gray-400">Welcome back, {userEmail}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="bg-button-secondary-500/30 border-primary-500/30 text-white hover:bg-primary-500/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Total Candidates"
            value={mockCandidates.length}
            icon={<Users className="h-5 w-5 text-primary-500" />}
            color="bg-primary-500/10"
          />
          <StatCard
            title="Hire Requests Sent"
            value={mockHireRequests.length}
            icon={<Briefcase className="h-5 w-5 text-blue-400" />}
            color="bg-blue-500/10"
          />
          <StatCard
            title="Interviews Scheduled"
            value={1}
            icon={<Calendar className="h-5 w-5 text-green-400" />}
            color="bg-green-500/10"
          />
          <StatCard
            title="Hiring Rate"
            value="33%"
            icon={<TrendingUp className="h-5 w-5 text-purple-400" />}
            color="bg-purple-500/10"
          />
        </div>

        <Tabs defaultValue="candidates" className="space-y-4">
          <TabsList className="bg-secondary-800/50 backdrop-blur-sm border border-primary-500/20">
            <TabsTrigger
              value="candidates"
              className="text-white data-[state=active]:bg-primary-500"
            >
              Candidates
            </TabsTrigger>
            <TabsTrigger
              value="requests"
              className="text-white data-[state=active]:bg-primary-500"
            >
              Hire Requests
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="text-white data-[state=active]:bg-primary-500"
            >
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="candidates" className="space-y-4">
            <Card className="bg-secondary-800/50 backdrop-blur-md border border-primary-500/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">
                      Candidate Database
                    </CardTitle>
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
                      />
                    </div>
                    <Button
                      size="sm"
                      className="bg-primary-500 hover:bg-primary-600"
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
                      <TableHead className="text-gray-300">Skills</TableHead>
                      <TableHead className="text-gray-300">
                        Experience
                      </TableHead>
                      <TableHead className="text-gray-300">
                        Availability
                      </TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCandidates.map((candidate) => (
                      <TableRow key={candidate.id} className="border-gray-700">
                        <TableCell>
                          <div>
                            <div className="font-medium text-white">
                              {candidate.name}
                            </div>
                            <div className="text-sm text-gray-400">
                              {candidate.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {candidate.skills.map((skill, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs border-primary-500/30 text-primary-400"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {candidate.experience}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              candidate.availability === "Available"
                                ? "border-green-500/30 text-green-400"
                                : "border-yellow-500/30 text-yellow-400"
                            }
                          >
                            {candidate.availability}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-button-secondary-500/30 border-primary-500/30 text-white"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              className="bg-primary-500 hover:bg-primary-600"
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
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            <Card className="bg-secondary-800/50 backdrop-blur-md border border-primary-500/20">
              <CardHeader>
                <CardTitle className="text-white">Hire Requests</CardTitle>
                <CardDescription className="text-gray-400">
                  Track your hiring requests and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">Candidate</TableHead>
                      <TableHead className="text-gray-300">Position</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Sent Date</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockHireRequests.map((request) => (
                      <TableRow key={request.id} className="border-gray-700">
                        <TableCell className="text-white font-medium">
                          {request.candidateName}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {request.position}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              request.status === "Accepted"
                                ? "border-green-500/30 text-green-400"
                                : request.status === "Rejected"
                                ? "border-red-500/30 text-red-400"
                                : "border-yellow-500/30 text-yellow-400"
                            }
                          >
                            {request.status === "Accepted" && (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            )}
                            {request.status === "Pending" && (
                              <Clock className="h-3 w-3 mr-1" />
                            )}
                            {request.status === "Rejected" && (
                              <XCircle className="h-3 w-3 mr-1" />
                            )}
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {request.sentDate}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            className="bg-primary-500 hover:bg-primary-600"
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card className="bg-secondary-800/50 backdrop-blur-md border border-primary-500/20">
              <CardHeader>
                <CardTitle className="text-white">
                  Recruitment Analytics
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Track your recruitment performance
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-primary-500 mx-auto mb-4" />
                  <p className="text-gray-400">
                    Analytics dashboard coming soon
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Card className="bg-secondary-800/50 backdrop-blur-md border border-primary-500/20 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader
        className={`flex flex-row items-center justify-between space-y-0 pb-2 ${color}`}
      >
        <CardTitle className="text-sm font-medium text-white">
          {title}
        </CardTitle>
        <div className="rounded-full p-2">{icon}</div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="text-3xl font-bold text-white">{value}</div>
      </CardContent>
    </Card>
  );
}
