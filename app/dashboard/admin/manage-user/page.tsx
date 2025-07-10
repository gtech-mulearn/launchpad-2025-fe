"use client";

import { Building2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import { Search, Eye, Edit, Trash2, Plus, Mail, Globe, Phone, Users } from "lucide-react";

// Mock data for companies and recruiters
const mockUsers = [
  {
    id: "1",
    category: "Company",
    name: "TechCorp Solutions",
    handle: "@techcorp",
    website: "https://techcorp.com",
    email: "john@techcorp.com",
    pocName: "John Smith",
    pocRole: "HR Manager",
    phone: "+91 9876543210",
    status: "Verified",
  },
  {
    id: "2",
    category: "Company",
    name: "InnovateLabs",
    handle: "@innovatelabs",
    website: "https://innovatelabs.com",
    email: "sarah@innovatelabs.com",
    pocName: "Sarah Johnson",
    pocRole: "Talent Acquisition",
    phone: "+91 9876543211",
    status: "Pending",
  },
  {
    id: "3",
    category: "Recruiter",
    name: "Alice Recruiter",
    email: "alice@recruiters.com",
    phone: "+91 9123456789",
    status: "Verified",
  },
  {
    id: "4",
    category: "Recruiter",
    name: "Bob Recruiter",
    email: "bob@recruiters.com",
    phone: "+91 9988776655",
    status: "Pending",
  },
];

export default function ManageUser() {
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState(mockUsers);

  useEffect(() => {
    setFiltered(
      mockUsers.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          (u.email && u.email.toLowerCase().includes(search.toLowerCase())) ||
          (u.pocName && u.pocName.toLowerCase().includes(search.toLowerCase()))
      )
    );
  }, [search]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="bg-secondary-800/50 backdrop-blur-md border border-primary-500/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white text-3xl font-bold">Manage Users</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage registered companies and recruiters
                </CardDescription>
              </div>
              <div className="flex gap-2 items-center">
                <div className="relative w-full max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 rounded bg-secondary-700/50 border border-primary-500/30 text-white w-full"
                  />
                </div>
                
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300 w-1/12">Category</TableHead>
                  <TableHead className="text-gray-300 w-1/4">Name</TableHead>
                  <TableHead className="text-gray-300 w-1/4">Contact</TableHead>
                  <TableHead className="text-gray-300 w-1/6">Status</TableHead>
                  <TableHead className="text-gray-300 w-1/6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-400">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((user) => (
                    <TableRow key={user.id} className="border-gray-700">
                      {/* Category */}
                      <TableCell>
                        <span className="flex items-center gap-1">
                          {user.category === "Company" ? (
                            <Building2 className="w-4 h-4 text-white" />
                          ) : (
                            <Users className="w-4 h-4 text-white" />
                          )}
                          <span className="text-white">{user.category}</span>
                        </span>
                      </TableCell>
                      {/* Name */}
                      <TableCell>
                        <div className="font-bold text-white">{user.name}</div>
                        {user.category === "Company" && (
                          <>
                            <div className="text-sm text-gray-400">{user.handle}</div>
                            <div className="flex items-center gap-1 mt-1 text-blue-400 text-xs">
                              <Globe className="w-4 h-4" />
                              <a href={user.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                {user.website}
                              </a>
                            </div>
                            <div className="mt-1 text-xs text-gray-400">
                              <span className="font-semibold text-white">{user.pocName}</span>
                              <span className="ml-2">{user.pocRole}</span>
                            </div>
                          </>
                        )}
                      </TableCell>
                      {/* Contact */}
                      <TableCell>
                        <div className="flex items-center gap-1 text-gray-200">
                          <Mail className="w-4 h-4" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-1 text-gray-200 mt-1">
                          <Phone className="w-4 h-4" />
                          {user.phone}
                        </div>
                      </TableCell>
                      {/* Status */}
                      <TableCell>
                        {user.status === "Verified" ? (
                          <Badge
                            className="bg-transparent border-green-600 text-green-400 flex items-center gap-1 px-2 py-0.5 w-fit"
                            variant="outline"
                          >
                            <CheckIcon className="w-4 h-4" /> Verified
                          </Badge>
                        ) : (
                          <Badge
                            className="bg-transparent border-yellow-600 text-yellow-400 flex items-center gap-1 px-2 py-0.5 w-fit"
                            variant="outline"
                          >
                            <ClockIcon className="w-4 h-4" /> Pending
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
                            onClick={() => {
                              setFiltered((prev) => prev.filter((c) => c.id !== user.id));
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          {user.status === "Pending" && (
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white ml-2"
                              onClick={() => {
                                setFiltered((prev) =>
                                  prev.map((c) =>
                                    c.id === user.id ? { ...c, status: "Verified" } : c
                                  )
                                );
                              }}
                            >
                              Approve
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Add these icons at the bottom of your file
function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <circle cx={12} cy={12} r={10} />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
    </svg>
  );
}