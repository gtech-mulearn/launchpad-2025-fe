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
import {
  Activity,
  Building2,
  Clock,
  FileCheck,
  FileText,
  Users,
  Briefcase,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Mock data for demonstration
const mockStats = {
  totalUsers: 1247,
  totalCompanies: 89,
  totalJobOffers: 156,
  totalTasks: 234,
  totalHireRequests: 67,
  pendingCompanyVerifications: 12,
  pendingJobOffers: 23,
  pendingTasks: 18,
};

export default function AdminDashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const email = localStorage.getItem("userEmail");

    if (role !== "admin") {
      router.push("/login");
      return;
    }

    setUserEmail(email || "");
  }, [router]);

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");

    // Force a page reload to clear any cached state
    window.location.href = "/login";
  };

  const stats = mockStats;
  return <></>;
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Admin Dashboard
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

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-secondary-800/50 backdrop-blur-sm border border-primary-500/20">
            <TabsTrigger
              value="overview"
              className="text-white data-[state=active]:bg-primary-500"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="text-white data-[state=active]:bg-primary-500"
            >
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Users"
                value={stats.totalUsers}
                icon={<Users className="h-5 w-5 text-primary-500" />}
                color="bg-primary-500/10"
              />
              <StatCard
                title="Total Companies"
                value={stats.totalCompanies}
                icon={<Building2 className="h-5 w-5 text-blue-400" />}
                color="bg-blue-500/10"
              />
              <StatCard
                title="Total Job Offers"
                value={stats.totalJobOffers}
                icon={<Briefcase className="h-5 w-5 text-green-400" />}
                color="bg-green-500/10"
              />
              <StatCard
                title="Total Tasks"
                value={stats.totalTasks}
                icon={<FileText className="h-5 w-5 text-purple-400" />}
                color="bg-purple-500/10"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <PendingCard
                title="Pending Company Verifications"
                value={stats.pendingCompanyVerifications}
                icon={<Clock className="h-5 w-5" />}
                color="text-amber-400"
                description="Companies awaiting verification"
              />
              <PendingCard
                title="Pending Job Offers"
                value={stats.pendingJobOffers}
                icon={<Briefcase className="h-5 w-5" />}
                color="text-blue-400"
                description="Job offers awaiting approval"
              />
              <PendingCard
                title="Pending Tasks"
                value={stats.pendingTasks}
                icon={<FileCheck className="h-5 w-5" />}
                color="text-green-400"
                description="Tasks awaiting approval"
              />
            </div>

            {/* Quick Actions */}
            <Card className="bg-secondary-800/50 backdrop-blur-md border border-primary-500/20">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage platform operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Button className="bg-primary-500 hover:bg-primary-600 text-white">
                    <Link
                      href="/dashboard/admin/manage-user"
                      className="flex items-center"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Manage Users
                    </Link>
                  </Button>
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                    <Link
                      href="/components/verify-companies"
                      className="flex items-center"
                    >
                      <Building2 className="w-4 h-4 mr-2" />
                      Verify Companies
                    </Link>
                  </Button>
                  <Button className="bg-green-500 hover:bg-green-600 text-white">
                    <Link
                      href="/components/review-job-offers"
                      className="flex items-center"
                    >
                      <Briefcase className="w-4 h-4 mr-2" />
                      Review Job Offers
                    </Link>
                  </Button>
                  <Button className="bg-purple-500 hover:bg-purple-600 text-white">
                    <Link
                      href="/components/approve-tasks"
                      className="flex items-center"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Approve Tasks
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card className="bg-secondary-800/50 backdrop-blur-md border border-primary-500/20">
              <CardHeader>
                <CardTitle className="text-white">Advanced Analytics</CardTitle>
                <CardDescription className="text-gray-400">
                  Coming soon - Advanced analytics and reporting
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <Activity className="h-12 w-12 text-primary-500 mx-auto mb-4" />
                  <p className="text-gray-400">
                    Advanced analytics will be available in a future update
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
  value: number;
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
        <div className="text-3xl font-bold text-white">
          {value.toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}

function PendingCard({
  title,
  value,
  icon,
  color,
  description,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  description: string;
}) {
  return (
    <Card className="bg-secondary-800/50 backdrop-blur-md border border-primary-500/20 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-white">
          {title}
        </CardTitle>
        <div className={`rounded-full p-2 ${color}`}>{icon}</div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className={`text-3xl font-bold ${color}`}>
          {value.toLocaleString()}
        </div>
        <p className="text-xs text-gray-400 mt-2">{description}</p>
      </CardContent>
    </Card>
  );
}
