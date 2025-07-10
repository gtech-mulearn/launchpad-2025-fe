"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, Plus, MapPin } from "lucide-react";

// Mock job data
const initialJobs = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    location: "Kochi",
    type: "full-time",
    salary: "8-15 LPA",
    company: "TechCorp Solutions",
    recruiter: "Alice Brown",
    experience: "3-7 years",
    skills: ["React", "TypeScript", "Next.js", "coder"],
    status: "Active",
    needApproval: false,
  },
  {
    id: "2",
    title: "IoT Engineer",
    location: "Trivandrum",
    type: "full-time",
    salary: "6-12 LPA",
    company: "InnovateLabs",
    recruiter: "Bob Wilson",
    experience: "2-5 years",
    skills: ["Arduino", "Raspberry Pi", "C++", "maker"],
    status: "Active",
    needApproval: false,
  },
  {
    id: "3",
    title: "Backend Developer",
    location: "Kochi",
    type: "full-time",
    salary: "10-18 LPA",
    company: "TechCorp Solutions",
    recruiter: "Alice Brown",
    experience: "4-8 years",
    skills: ["Node.js", "Express", "MongoDB", "api"],
    status: "Pending",
    needApproval: true,
  },
];

const skillColors: Record<string, string> = {
  React: "border-orange-500 text-orange-400",
  "TypeScript": "border-orange-500 text-orange-400",
  "Next.js": "border-orange-500 text-orange-400",
  "Arduino": "border-orange-500 text-orange-400",
  "Raspberry Pi": "border-orange-500 text-orange-400",
  "C++": "border-orange-500 text-orange-400",
  "Node.js": "border-orange-500 text-orange-400",
  "Express": "border-orange-500 text-orange-400",
  "MongoDB": "border-orange-500 text-orange-400",
  "coder": "border-blue-500 text-blue-400",
  "maker": "border-green-600 text-green-400",
  "api": "border-blue-500 text-blue-400",
};

export default function JobOfferListPage() {
  const [jobs, setJobs] = useState(initialJobs);

  // Sort: jobs needing approval first
  const sortedJobs = [
    ...jobs.filter((j) => j.needApproval),
    ...jobs.filter((j) => !j.needApproval),
  ];

  const handleApprove = (id: string) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === id
          ? { ...j, status: "Active", needApproval: false }
          : j
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="bg-secondary-800/50 backdrop-blur-md border border-primary-500/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white text-3xl font-bold">Jobs</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage job postings
                </CardDescription>
              </div>
              
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white w-1/4">Job Details</TableHead>
                  <TableHead className="text-white w-1/5">Company</TableHead>
                  <TableHead className="text-white w-1/4">Requirements</TableHead>
                  <TableHead className="text-white w-1/8">Status</TableHead>
                  <TableHead className="text-white w-1/8">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedJobs.map((job) => (
                  <TableRow key={job.id} className="border-gray-700">
                    {/* Job Details */}
                    <TableCell>
                      <div className="font-bold text-white">{job.title}</div>
                      <div className="flex items-center gap-1 text-gray-300 text-sm mt-1">
                        <MapPin className="w-4 h-4" />
                        {job.location} <span className="mx-1">•</span> {job.type}
                      </div>
                      {/* Salary removed */}
                    </TableCell>
                    {/* Company */}
                    <TableCell>
                      <div className="font-bold text-white">{job.company}</div>
                      <div className="text-gray-300">{job.recruiter}</div>
                    </TableCell>
                    {/* Requirements */}
                    <TableCell>
                      <div className="text-gray-200 mb-1">{job.experience}</div>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill) => (
                          <span
                            key={skill}
                            className={`border rounded-full px-2 py-0.5 text-xs ${skillColors[skill] || "border-gray-500 text-gray-300"}`}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    {/* Status */}
                    <TableCell>
                      {job.status === "Active" ? (
                        <Badge className="border-green-600 text-green-400 px-4 py-1" variant="outline">
                          Active
                        </Badge>
                      ) : (
                        <Badge className="border-yellow-600 text-yellow-400 px-4 py-1" variant="outline">
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    {/* Actions */}
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="border border-orange-500 text-orange-500 hover:bg-orange-500/10 bg-transparent"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="border border-blue-500 text-blue-400 hover:bg-blue-500/10 bg-transparent"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="border border-red-500 text-red-500 hover:bg-red-500/10 bg-transparent"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        {job.needApproval && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white ml-2"
                            onClick={() => handleApprove(job.id)}
                          >
                            Approve
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}