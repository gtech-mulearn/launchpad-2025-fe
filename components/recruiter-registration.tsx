"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  User,
  Mail,
  Lock,
  Phone,
  Briefcase,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { LoadingSpinner } from "./loading-spinner";
import { ScrollReveal } from "./scroll-reveal";
import { apiHandler } from "@/lib/axios";
import { useLocalStorage } from "@/hooks/misc";
import { useRouter } from "next/navigation";

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: string;
}

interface FormErrors {
  [key: string]: string;
}

export function RecruiterRegistration() {
  const { push } = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [company_id, setCompanyId] = useLocalStorage("userId", "");
  const [accessToken, setAccessToken] = useLocalStorage("accessToken", "");
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name) {
      newErrors.name = "Name is required";
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s\-]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.role) {
      newErrors.role = "Role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await apiHandler.post(
        "/launchpad/register-recruiter/",
        { company_id: company_id, ...formData },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      push("/dashboard/company");
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-900 py-12 px-4">
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#2a2a2a_1px,transparent_1px),linear-gradient(to_bottom,#2a2a2a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>

      <div className="container mx-auto max-w-2xl relative z-10">
        {/* Header */}
        <ScrollReveal direction="down" duration={800}>
          <div className="text-center mb-8">
            <Link
              href="/dashboard/company"
              className="inline-flex items-center text-white hover:text-primary-500 transition-colors duration-300 mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="text-sm uppercase tracking-widest">Back</span>
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tighter mb-4">
              Recruiter <span className="text-primary-500">Registration</span>
            </h1>
            <p className="text-gray-400 text-lg">Register a Recruiter</p>
          </div>
        </ScrollReveal>

        {/* Registration Form */}
        <ScrollReveal direction="up" delay={300} duration={800}>
          <Card className="bg-white/5 border-primary-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-xl uppercase tracking-tight">
                Recruiter Registration Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Recruiter Details Section */}
                <ScrollReveal direction="up" delay={500}>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <Briefcase className="w-5 h-5 text-primary-500" />
                      <h3 className="text-white font-medium uppercase tracking-widest text-sm">
                        Recruiter Details
                      </h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label
                          htmlFor="name"
                          className="text-white text-sm uppercase tracking-widest"
                        >
                          Name *
                        </Label>
                        <div className="relative mt-1">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            id="name"
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                              handleInputChange("name", e.target.value)
                            }
                            className="pl-10 bg-white/10 border-primary-500/20 text-white placeholder:text-gray-400"
                            placeholder="Full Name"
                          />
                        </div>
                        {errors.name && (
                          <p className="text-red-400 text-xs mt-1">
                            {errors.name}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label
                          htmlFor="role"
                          className="text-white text-sm uppercase tracking-widest"
                        >
                          Role *
                        </Label>
                        <Input
                          id="role"
                          type="text"
                          value={formData.role}
                          onChange={(e) =>
                            handleInputChange("role", e.target.value)
                          }
                          className="mt-1 bg-white/10 border-primary-500/20 text-white placeholder:text-gray-400"
                          placeholder="e.g. Human Resources"
                        />
                        {errors.role && (
                          <p className="text-red-400 text-xs mt-1">
                            {errors.role}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label
                          htmlFor="email"
                          className="text-white text-sm uppercase tracking-widest"
                        >
                          Email Address *
                        </Label>
                        <div className="relative mt-1">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
                            className="pl-10 bg-white/10 border-primary-500/20 text-white placeholder:text-gray-400"
                            placeholder="recruiter@example.com"
                          />
                        </div>
                        {errors.email && (
                          <p className="text-red-400 text-xs mt-1">
                            {errors.email}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label
                          htmlFor="phone"
                          className="text-white text-sm uppercase tracking-widest"
                        >
                          Phone Number *
                        </Label>
                        <div className="relative mt-1">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) =>
                              handleInputChange("phone", e.target.value)
                            }
                            className="pl-10 bg-white/10 border-primary-500/20 text-white placeholder:text-gray-400"
                            placeholder="+91 9876543210"
                          />
                        </div>
                        {errors.phone && (
                          <p className="text-red-400 text-xs mt-1">
                            {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Login Credentials Section */}
                <ScrollReveal direction="up" delay={700}>
                  <div className="space-y-4 pt-6 border-t border-primary-500/20">
                    <div className="flex items-center space-x-2 mb-4">
                      <Lock className="w-5 h-5 text-primary-500" />
                      <h3 className="text-white font-medium uppercase tracking-widest text-sm">
                        Login Credentials
                      </h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label
                          htmlFor="password"
                          className="text-white text-sm uppercase tracking-widest"
                        >
                          Password *
                        </Label>
                        <div className="relative mt-1">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) =>
                              handleInputChange("password", e.target.value)
                            }
                            className="pl-10 bg-white/10 border-primary-500/20 text-white placeholder:text-gray-400"
                            placeholder="Minimum 8 characters"
                          />
                        </div>
                        {errors.password && (
                          <p className="text-red-400 text-xs mt-1">
                            {errors.password}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label
                          htmlFor="confirmPassword"
                          className="text-white text-sm uppercase tracking-widest"
                        >
                          Confirm Password *
                        </Label>
                        <div className="relative mt-1">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) =>
                              handleInputChange(
                                "confirmPassword",
                                e.target.value
                              )
                            }
                            className="pl-10 bg-white/10 border-primary-500/20 text-white placeholder:text-gray-400"
                            placeholder="Re-enter your password"
                          />
                        </div>
                        {errors.confirmPassword && (
                          <p className="text-red-400 text-xs mt-1">
                            {errors.confirmPassword}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Submit Button */}
                <ScrollReveal direction="up" delay={900}>
                  <div className="pt-6">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 text-sm uppercase tracking-widest font-medium transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
                    >
                      {isSubmitting ? (
                        <LoadingSpinner
                          size="sm"
                          text="Submitting Registration"
                        />
                      ) : (
                        "Submit Registration"
                      )}
                    </Button>
                  </div>
                  <p className="text-gray-400 text-xs text-center leading-relaxed mt-4">
                    By submitting this form, you agree to our terms and
                    conditions. We will review your application and contact you
                    with further details about the recruitment process.
                  </p>
                </ScrollReveal>
              </form>
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>
    </div>
  );
}
