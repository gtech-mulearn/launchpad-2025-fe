"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import {
  Users,
  CheckCircle,
  TrendingUp,
  LogOut,
  Search,
  Eye,
  MessageSquare,
} from "lucide-react"

// Mock data for demonstration
const mockRecruiters = [
  { id: "1", name: "Alice Recruiter" },
  { id: "2", name: "Bob Recruiter" },
  { id: "3", name: "Charlie Recruiter" },
]

const mockApprovedCandidates = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    skills: ["React", "Node.js", "TypeScript"],
    experience: "3 years",
    status: "Hired",
    availability: "Available",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    skills: ["Python", "Django", "PostgreSQL"],
    experience: "5 years",
    status: "Hired",
    availability: "Available",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    skills: ["Java", "Spring Boot", "AWS"],
    experience: "4 years",
    status: "Hired",
    availability: "Busy",
  },
]

const hiringRate = mockApprovedCandidates.length > 0
  ? Math.round((mockApprovedCandidates.length / 10) * 100) // Assume 10 total candidates for demo
  : 0

export default function CompanyDashboard() {
    const router = useRouter()
    const [userEmail, setUserEmail] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
  useEffect(() => {
      const role = localStorage.getItem("userRole")
      const email = localStorage.getItem("userEmail")
  
      if (role !== "company") {
        router.push("/login")
        return
      }
  
      setUserEmail(email || "")
    }, [router])
    const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem("userRole")
    localStorage.removeItem("userEmail")

    // Force a page reload to clear any cached state
    window.location.href = "/login"
  }


  const filteredCandidates = mockApprovedCandidates.filter(
    (candidate) =>
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Company Dashboard</h1>
            <p className="text-gray-400">Welcome back</p>
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
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3 mb-8">
          <StatCard
            title="Recruiters"
            value={mockRecruiters.length}
            icon={<Users className="h-5 w-5 text-primary-500" />}
            color="bg-primary-500/10"
          />
          <StatCard
            title="Approved Candidates"
            value={mockApprovedCandidates.length}
            icon={<CheckCircle className="h-5 w-5 text-green-400" />}
            color="bg-green-500/10"
          />
          <StatCard
            title="Hiring Rate"
            value={`${hiringRate}%`}
            icon={<TrendingUp className="h-5 w-5 text-purple-400" />}
            color="bg-purple-500/10"
          />
        </div>

        <Tabs defaultValue="approved" className="space-y-4">
          <TabsList className="bg-secondary-800/50 backdrop-blur-sm border border-primary-500/20">
            <TabsTrigger value="approved" className="text-white data-[state=active]:bg-primary-500">
              Approved Candidates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="approved" className="space-y-4">
            <Card className="bg-secondary-800/50 backdrop-blur-md border border-primary-500/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Approved Candidates</CardTitle>
                    <CardDescription className="text-gray-400">List of candidates approved by your company</CardDescription>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search candidates..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-secondary-700/50 border-primary-500/30 text-white"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">Candidate</TableHead>
                      <TableHead className="text-gray-300">Skills</TableHead>
                      <TableHead className="text-gray-300">Experience</TableHead>
                      <TableHead className="text-gray-300">Availability</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCandidates.map((candidate) => (
                      <TableRow key={candidate.id} className="border-gray-700">
                        <TableCell>
                          <div>
                            <div className="font-medium text-white">{candidate.name}</div>
                            <div className="text-sm text-gray-400">{candidate.email}</div>
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
                        <TableCell className="text-gray-300">{candidate.experience}</TableCell>
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
                            <Button size="sm" variant="outline" className="bg-button-secondary-500/30 border-primary-500/30 text-white">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button size="sm" className="bg-primary-500 hover:bg-primary-600">
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
        </Tabs>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
  color,
}: { title: string; value: number | string; icon: React.ReactNode; color: string }) {
  return (
    <Card className="bg-secondary-800/50 backdrop-blur-md border border-primary-500/20 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-2 ${color}`}>
        <CardTitle className="text-sm font-medium text-white">{title}</CardTitle>
        <div className="rounded-full p-2">{icon}</div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="text-3xl font-bold text-white">{value}</div>
      </CardContent>
    </Card>
  )
}