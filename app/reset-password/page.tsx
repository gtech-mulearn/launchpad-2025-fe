"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { AlertCircle, Lock } from "lucide-react";
import { toast } from "sonner";
import { useResetPassword, useVerifyResetToken } from "@/hooks/auth";

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const type = searchParams.get("type") as "company" | "recruiter";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(true);

  const { mutate: verifyToken } = useVerifyResetToken();
  const { mutate: resetPassword, isPending: isResetting } = useResetPassword();

  useEffect(() => {
    if (!token || !type) {
      router.push("/forgot-password");
      return;
    }

    const verifyResetToken = async () => {
      const t = toast.loading("Verifying token...");
      try {
        await verifyToken(
          { token, user_type: type },
          {
            onSuccess: () => {
              toast.success("Token verified successfully", { id: t });
              setIsVerifying(false);
            },
            onError: (error: any) => {
              const errorMessage =
                error?.response?.data?.general?.[0] ||
                error?.response?.data?.non_field_errors?.[0] ||
                "Invalid or expired reset token";
              toast.error(errorMessage, { id: t });
              router.push("/forgot-password");
            },
          }
        );
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.general?.[0] ||
          err?.response?.data?.non_field_errors?.[0] ||
          "Invalid or expired reset token";
        toast.error(errorMessage, { id: t });
        router.push("/forgot-password");
      }
    };

    verifyResetToken();
  }, [token, type, router, verifyToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    const t = toast.loading("Resetting password...");

    try {
      await resetPassword(
        {
          token: token!,
          user_type: type!,
          new_password: newPassword,
          confirm_password: confirmPassword,
        },
        {
          onSuccess: () => {
            toast.success("Password reset successfully", { id: t });
            router.push("/login");
          },
          onError: (error: any) => {
            const errorMessage =
              error?.response?.data?.general?.[0] ||
              error?.response?.data?.non_field_errors?.[0] ||
              "Failed to reset password";
            setError(errorMessage);
            toast.error(errorMessage, { id: t });
          },
        }
      );
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.general?.[0] ||
        err?.response?.data?.non_field_errors?.[0] ||
        "Failed to reset password";
      setError(errorMessage);
      toast.error(errorMessage, { id: t });
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span className="text-white">Verifying reset token...</span>
        </div>
      </div>
    );
  }

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
              Enter your new password below
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-white">
                    New Password
                  </Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="bg-secondary-700/50 border-primary-500/30 text-white placeholder:text-gray-400 focus:border-primary-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-white">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="bg-secondary-700/50 border-primary-500/30 text-white placeholder:text-gray-400 focus:border-primary-500"
                  />
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
                disabled={isResetting}
              >
                {isResetting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Resetting...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Reset Password
                  </div>
                )}
              </Button>
            </form>

            <div className="text-center">
              <Link
                href="/login"
                className="text-sm text-primary-500 hover:text-primary-400 transition-colors"
              >
                Back to login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
