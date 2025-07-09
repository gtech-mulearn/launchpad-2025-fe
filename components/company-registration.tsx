"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  Building,
  Mail,
  Lock,
  Phone,
  Globe,
  MapPin,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { LoadingSpinner } from "./loading-spinner";
import { ScrollReveal } from "./scroll-reveal";
import { useLocalStorage } from "@/hooks/misc";
import { useSignupCompany } from "@/hooks/auth";

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  contactPerson: string;
  phoneNumber: string;
  companyWebsite: string;
  headOfficeAddress: string;
  additionalInfo: string;
}

interface FormErrors {
  [key: string]: string;
}

export function CompanyRegistration() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    contactPerson: "",
    phoneNumber: "",
    companyWebsite: "",
    headOfficeAddress: "",
    additionalInfo: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const signUp = useSignupCompany();
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Company name validation
    if (!formData.companyName) {
      newErrors.companyName = "Company name is required";
    }

    // Contact person validation
    if (!formData.contactPerson) {
      newErrors.contactPerson = "Contact person name is required";
    }

    // Phone number validation
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\+?[\d\s\-$$$$]{10,}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    try {
      await signUp.mutateAsync({
        name: formData.companyName,
        username: formData.email,
        password: formData.password,
        poc_name: formData.contactPerson,
        poc_role: "Recruiter",
        poc_email: formData.email,
        poc_phone: formData.phoneNumber,
      });
      setIsRegistered(true);
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isRegistered) {
    return (
      <div className="min-h-screen bg-secondary-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <ScrollReveal direction="scale" duration={800}>
            <Card className="bg-white border-primary-500/20">
              <CardContent className="p-8 text-center">
                <ScrollReveal direction="scale" delay={200}>
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-primary-500" />
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal direction="up" delay={400}>
                  <h2 className="text-2xl font-bold text-secondary-900 mb-4 uppercase tracking-tight">
                    Registration Successful!
                  </h2>
                </ScrollReveal>

                <ScrollReveal direction="up" delay={600}>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Thank you for registering with Launchpad Kerala 2025. Your
                    application has been received and you have been added to our
                    waiting list.
                  </p>
                </ScrollReveal>

                <ScrollReveal direction="up" delay={800}>
                  <div className="bg-primary-500/10 border border-primary-500/20 rounded-lg p-4 mb-6">
                    <p className="text-primary-600 font-medium text-sm uppercase tracking-widest">
                      Status: Waiting List
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      We will contact you soon with further details about the
                      recruitment process.
                    </p>
                  </div>
                </ScrollReveal>

                <ScrollReveal direction="up" delay={1000}>
                  <Button
                    asChild
                    className="w-full bg-primary-500 hover:bg-primary-600 text-white uppercase tracking-widest text-sm font-medium"
                  >
                    <Link href="/">Return to Home</Link>
                  </Button>
                </ScrollReveal>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-900 py-12 px-4">
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#2a2a2a_1px,transparent_1px),linear-gradient(to_bottom,#2a2a2a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>

      <div className="container mx-auto max-w-2xl relative z-10">
        {/* Header */}
        <ScrollReveal direction="down" duration={800}>
          <div className="text-center mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-white hover:text-primary-500 transition-colors duration-300 mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="text-sm uppercase tracking-widest">
                Back to Home
              </span>
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tighter mb-4">
              company <span className="text-primary-500">Registration</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Join Launchpad Kerala 2025 as a recruiting partner
            </p>
          </div>
        </ScrollReveal>

        {/* Registration Form */}
        <ScrollReveal direction="up" delay={300} duration={800}>
          <Card className="bg-white/5 border-primary-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-xl uppercase tracking-tight">
                Company Registration Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Login Credentials Section */}
                <ScrollReveal direction="up" delay={500}>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <Lock className="w-5 h-5 text-primary-500" />
                      <h3 className="text-white font-medium uppercase tracking-widest text-sm">
                        Login Credentials
                      </h3>
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
                            placeholder="company@example.com"
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
                            handleInputChange("confirmPassword", e.target.value)
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
                </ScrollReveal>

                {/* Company Details Section */}
                <ScrollReveal direction="up" delay={700}>
                  <div className="space-y-4 pt-6 border-t border-primary-500/20">
                    <div className="flex items-center space-x-2 mb-4">
                      <Building className="w-5 h-5 text-primary-500" />
                      <h3 className="text-white font-medium uppercase tracking-widest text-sm">
                        Company Details
                      </h3>
                    </div>

                    <div>
                      <Label
                        htmlFor="companyName"
                        className="text-white text-sm uppercase tracking-widest"
                      >
                        Company Name *
                      </Label>
                      <Input
                        id="companyName"
                        type="text"
                        value={formData.companyName}
                        onChange={(e) =>
                          handleInputChange("companyName", e.target.value)
                        }
                        className="mt-1 bg-white/10 border-primary-500/20 text-white placeholder:text-gray-400"
                        placeholder="Your Company Name"
                      />
                      {errors.companyName && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.companyName}
                        </p>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label
                          htmlFor="contactPerson"
                          className="text-white text-sm uppercase tracking-widest"
                        >
                          Contact Person *
                        </Label>
                        <Input
                          id="contactPerson"
                          type="text"
                          value={formData.contactPerson}
                          onChange={(e) =>
                            handleInputChange("contactPerson", e.target.value)
                          }
                          className="mt-1 bg-white/10 border-primary-500/20 text-white placeholder:text-gray-400"
                          placeholder="Full Name"
                        />
                        {errors.contactPerson && (
                          <p className="text-red-400 text-xs mt-1">
                            {errors.contactPerson}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label
                          htmlFor="phoneNumber"
                          className="text-white text-sm uppercase tracking-widest"
                        >
                          Phone Number *
                        </Label>
                        <div className="relative mt-1">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            id="phoneNumber"
                            type="tel"
                            value={formData.phoneNumber}
                            onChange={(e) =>
                              handleInputChange("phoneNumber", e.target.value)
                            }
                            className="pl-10 bg-white/10 border-primary-500/20 text-white placeholder:text-gray-400"
                            placeholder="+91 9876543210"
                          />
                        </div>
                        {errors.phoneNumber && (
                          <p className="text-red-400 text-xs mt-1">
                            {errors.phoneNumber}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor="companyWebsite"
                        className="text-white text-sm uppercase tracking-widest"
                      >
                        Company Website{" "}
                        <span className="text-gray-400">(Optional)</span>
                      </Label>
                      <div className="relative mt-1">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="companyWebsite"
                          type="url"
                          value={formData.companyWebsite}
                          onChange={(e) =>
                            handleInputChange("companyWebsite", e.target.value)
                          }
                          className="pl-10 bg-white/10 border-primary-500/20 text-white placeholder:text-gray-400"
                          placeholder="https://www.yourcompany.com"
                        />
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor="headOfficeAddress"
                        className="text-white text-sm uppercase tracking-widest"
                      >
                        Head Office Address{" "}
                        <span className="text-gray-400">(Optional)</span>
                      </Label>
                      <div className="relative mt-1">
                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Textarea
                          id="headOfficeAddress"
                          value={formData.headOfficeAddress}
                          onChange={(e) =>
                            handleInputChange(
                              "headOfficeAddress",
                              e.target.value
                            )
                          }
                          className="pl-10 bg-white/10 border-primary-500/20 text-white placeholder:text-gray-400 min-h-[80px]"
                          placeholder="Complete address with city, state, and postal code"
                        />
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor="additionalInfo"
                        className="text-white text-sm uppercase tracking-widest"
                      >
                        Additional Information{" "}
                        <span className="text-gray-400">(Optional)</span>
                      </Label>
                      <Textarea
                        id="additionalInfo"
                        value={formData.additionalInfo}
                        onChange={(e) =>
                          handleInputChange("additionalInfo", e.target.value)
                        }
                        className="mt-1 bg-white/10 border-primary-500/20 text-white placeholder:text-gray-400 min-h-[100px]"
                        placeholder="Any additional information about your company or recruitment requirements"
                      />
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

                  {/* Terms */}
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
