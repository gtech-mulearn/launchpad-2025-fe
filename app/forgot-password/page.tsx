"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForgotPassword } from "@/hooks/auth";
import { Mail, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState<"company" | "recruiter">("company");
  const [error, setError] = useState("");
  const { mutate: forgotPassword, isPending: isLoading } = useForgotPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = toast.loading("Sending reset link...");
    setError("");

    try {
      await forgotPassword({ email, user_type: userType }, {
        onSuccess: () => {
          toast.success("Reset link has been sent to your email", { id: t });
        },
        onError: (error: any) => {
          const errorMessage = error?.response?.data?.general?.[0] || 
                             error?.response?.data?.non_field_errors?.[0] || 
                             "Failed to send reset link";
          setError(errorMessage);
          toast.error(errorMessage, { id: t });
        }
      });
    } catch (err: any) {
      const errorMessage = err?.response?.data?.general?.[0] || 
                         err?.response?.data?.non_field_errors?.[0] || 
                         "Failed to send reset link";
      setError(errorMessage);
      toast.error(errorMessage, { id: t });
    }
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
              Reset Password
            </CardTitle>
            <CardDescription className="text-gray-400">
              Enter your email to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-secondary-700/50 border-primary-500/30 text-white placeholder:text-gray-400 focus:border-primary-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Account Type</Label>
                  <RadioGroup
                    value={userType}
                    onValueChange={(value: "company" | "recruiter") => setUserType(value)}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="company" id="company" />
                      <Label htmlFor="company" className="text-white">Company</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="recruiter" id="recruiter" />
                      <Label htmlFor="recruiter" className="text-white">Recruiter</Label>
                    </div>
                  </RadioGroup>
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
                    Sending...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Send Reset Link
                  </div>
                )}
              </Button>
            </form>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-400">
                Remembered your password?{" "}
                <Link
                  href="/login"
                  className="text-primary-500 hover:text-primary-400 transition-colors"
                >
                  Log in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
