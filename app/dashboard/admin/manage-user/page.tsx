"use client";

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
import { Search } from "lucide-react";

// Mock data for registered companies (users)
const mockCompanies = [
  {
    id: "1",
    companyName: "Tech Innovators Pvt Ltd",
    email: "info@techinnovators.com",
    contactPerson: "Alice Johnson",
    phone: "+91 9876543210",
    status: "Active",
    registeredAt: "2024-06-01",
  },
  {
    id: "2",
    companyName: "Green Energy Solutions",
    email: "contact@greenenergy.com",
    contactPerson: "Bob Smith",
    phone: "+91 9123456789",
    status: "Pending",
    registeredAt: "2024-06-10",
  },
  {
    id: "3",
    companyName: "EduTech Kerala",
    email: "hello@edutechkerala.com",
    contactPerson: "Priya Menon",
    phone: "+91 9988776655",
    status: "Active",
    registeredAt: "2024-07-01",
  },
];

export default function ManageUser() {
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState(mockCompanies);

  useEffect(() => {
    setFiltered(
      mockCompanies.filter(
        (c) =>
          c.companyName.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase()) ||
          c.contactPerson.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search]);

  return (
    <div className="max-w-5xl mx-auto py-10">
      <Card className="bg-secondary-800/50 backdrop-blur-md border border-primary-500/20">
        <CardHeader>
          <CardTitle className="text-white">Registered Companies</CardTitle>
          <CardDescription className="text-gray-400">
            List of all companies registered on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search companies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 rounded bg-secondary-700/50 border border-primary-500/30 text-white w-full"
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-300">Company Name</TableHead>
                <TableHead className="text-gray-300">Contact Person</TableHead>
                <TableHead className="text-gray-300">Email</TableHead>
                <TableHead className="text-gray-300">Phone</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Registered At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-400">
                    No companies found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell className="text-white font-medium">
                      {company.companyName}
                    </TableCell>
                    <TableCell className="text-gray-200">
                      {company.contactPerson}
                    </TableCell>
                    <TableCell className="text-gray-200">
                      {company.email}
                    </TableCell>
                    <TableCell className="text-gray-200">
                      {company.phone}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          company.status === "Active"
                            ? "border-green-500/30 text-green-400"
                            : "border-yellow-500/30 text-yellow-400"
                        }
                        variant="outline"
                      >
                        {company.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-400">
                      {company.registeredAt}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
