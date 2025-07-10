"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Globe, CheckCircle, Clock } from "lucide-react";

// Mock company data
const initialCompanies = [
  {
    id: "1",
    name: "TechCorp Solutions",
    handle: "@techcorp",
    website: "https://techcorp.com",
    email: "info@techcorp.com",
    phone: "+91 9876543210",
    status: "Pending",
    requestedAt: "2025-07-10 10:30",
    approvedAt: null,
  },
  {
    id: "2",
    name: "InnovateLabs",
    handle: "@innovatelabs",
    website: "https://innovatelabs.com",
    email: "hello@innovatelabs.com",
    phone: "+91 9876543211",
    status: "Pending",
    requestedAt: "2025-07-09 14:20",
    approvedAt: null,
  },
  {
    id: "3",
    name: "EduTech Kerala",
    handle: "@edutechkerala",
    website: "https://edutechkerala.com",
    email: "contact@edutechkerala.com",
    phone: "+91 9988776655",
    status: "Approved",
    requestedAt: "2025-07-01 09:00",
    approvedAt: "2025-07-05 16:45",
  },
];

export default function CompanyListPage() {
  const [companies, setCompanies] = useState(initialCompanies);

  // Sort: Pending first, then Approved
  const sortedCompanies = [
    ...companies.filter((c) => c.status === "Pending"),
    ...companies.filter((c) => c.status === "Approved"),
  ];

  const handleApprove = (id: string) => {
    setCompanies((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: "Approved",
              approvedAt: new Date().toLocaleString("en-GB", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              }),
            }
          : c
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 p-6">
      <div className="max-w-5xl mx-auto">
        <Card className="bg-secondary-800/50 backdrop-blur-md border border-primary-500/20">
          <CardHeader>
            <CardTitle className="text-white text-2xl font-bold">Company List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-300">Company</TableHead>
                  <TableHead className="text-gray-300">Contact</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Requested At</TableHead>
                  <TableHead className="text-gray-300">Approved At</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedCompanies.map((company) => (
                  <TableRow key={company.id} className="border-gray-700">
                    <TableCell>
                      <div className="font-bold text-white">{company.name}</div>
                      <div className="text-sm text-gray-400">{company.handle}</div>
                      <div className="flex items-center gap-1 mt-1 text-blue-400 text-xs">
                        <Globe className="w-4 h-4" />
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {company.website}
                        </a>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-gray-200">{company.email}</div>
                      <div className="text-gray-200">{company.phone}</div>
                    </TableCell>
                    <TableCell>
                      {company.status === "Pending" ? (
                        <Badge className="border-yellow-600 text-yellow-400 flex items-center gap-1 px-3 py-1" variant="outline">
                          <Clock className="w-4 h-4" /> Pending
                        </Badge>
                      ) : (
                        <Badge className="border-green-600 text-green-400 flex items-center gap-1 px-3 py-1" variant="outline">
                          <CheckCircle className="w-4 h-4" /> Approved
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-400">{company.requestedAt}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-400">{company.approvedAt || "-"}</span>
                    </TableCell>
                    <TableCell>
                      {company.status === "Pending" && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleApprove(company.id)}
                        >
                          Approve
                        </Button>
                      )}
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