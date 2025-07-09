"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";
import { useLoginCompany, useLoginRecruiter } from "@/hooks/auth";
import { useLocalStorageQuery } from "@/hooks/misc";
import { set } from "react-hook-form";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState<"admin" | "recruiter" | "company">("admin");
  const [accessToken, setAccessToken] = useLocalStorageQuery("accessToken", "");
  const [userId, setUserId] = useLocalStorageQuery("userId", "");
  const clogin = useLoginCompany();
  const rlogin = useLoginRecruiter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      setError("Email and password are required");
      setIsLoading(false);
      return;
    }
    console.log("Role:", role);
    if (role === "admin") {
    } else if (role === "recruiter") {
      await rlogin.mutateAsync(
        { email, pass: password },
        {
          onSuccess: (data) => {
            console.log("Login successful:", data);
            setAccessToken(data?.accessToken || "");
            setUserId(data?.id || "");
            router.push("dashboard/recruiter/");
          },
          onError: (err: any) => {
            setError(err.response?.data?.detail || "Login failed");
            setIsLoading(false);
          },
        }
      );
    } else if (role === "company") {
      await clogin.mutateAsync(
        {
          email,
          pass: password,
        },
        {
          onSuccess: (data) => {
            console.log("Company login successful:", data);
            setAccessToken(data?.accessToken || "");

            setUserId(data?.id || "");
            router.push("dashboard/company/");
          },
          onError: (err: any) => {
            setError(err.response?.data?.detail || "Login failed");
            setIsLoading(false);
          },
        }
      );
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-secondary-800/50 backdrop-blur-md border border-primary-500/20 shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <div className="flex items-center justify-center mb-4">
              <img
                src="/images/logo.webp"
                alt="Launchpad Kerala Logo"
                className="h-12 w-auto"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-gray-400">
              Sign in to your Launchpad Kerala account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role" className="text-white">
                  Role
                </Label>
                <Select
                  defaultValue={role}
                  onValueChange={(value) =>
                    setRole(value as "admin" | "recruiter" | "company")
                  }
                >
                  <SelectTrigger className="bg-secondary-700/50 border-primary-500/30 text-white placeholder:text-gray-400 focus:border-primary-500">
                    <SelectValue placeholder={"Admin"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="recruiter">Recruiter</SelectItem>
                    <SelectItem value="company">Company</SelectItem>
                  </SelectContent>
                </Select>
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  // type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-secondary-700/50 border-primary-500/30 text-white placeholder:text-gray-400 focus:border-primary-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-secondary-700/50 border-primary-500/30 text-white placeholder:text-gray-400 focus:border-primary-500 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <span className="text-sm text-red-400">{error}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-primary-500 hover:bg-primary-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </div>
                )}
              </Button>
            </form>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-400">
                Don't have an account?{" "}
                <Link
                  href="/register/company"
                  className="text-primary-500 hover:text-primary-400 transition-colors"
                >
                  Register here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
