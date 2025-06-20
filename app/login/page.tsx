"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Authentication logic
    if (formData.email === "admin@gmail.com" && formData.password === "12345678") {
      // Admin login
      localStorage.setItem("userRole", "admin")
      localStorage.setItem("userEmail", formData.email)
      router.push("/dashboard/admin")
    } else if (formData.email === "123@gmail.com" && formData.password === "12345678") {
      // Recruiter login
      localStorage.setItem("userRole", "recruiter")
      localStorage.setItem("userEmail", formData.email)
      router.push("/dashboard/recruiter")
    } else {
      setError("Invalid email or password")
    }

    setIsLoading(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] opacity-5"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Back to Home Link */}
        <Link
          href="/"
          className="inline-flex items-center text-white/70 hover:text-primary-500 transition-colors duration-300 mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="text-sm uppercase tracking-widest">Back to Home</span>
        </Link>

        <Card className="bg-secondary-800/50 backdrop-blur-md border border-primary-500/20 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center mb-4">
              <img src="/images/logo.webp" alt="Launchpad Kerala Logo" className="h-12 w-auto" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
            <CardDescription className="text-gray-400">Sign in to your Launchpad Kerala account</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white text-sm uppercase tracking-widest">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="bg-secondary-700/50 border-primary-500/30 text-white placeholder:text-gray-400 focus:border-primary-500 focus:ring-primary-500/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white text-sm uppercase tracking-widest">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="bg-secondary-700/50 border-primary-500/30 text-white placeholder:text-gray-400 focus:border-primary-500 focus:ring-primary-500/20 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-red-400 text-sm text-center bg-red-900/20 border border-red-500/20 rounded p-2">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between">
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary-500 hover:text-primary-400 transition-colors duration-300"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 text-sm uppercase tracking-widest transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-primary-500/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-secondary-800 px-2 text-gray-400 tracking-widest">Demo Credentials</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-gray-400">
              <div className="bg-secondary-700/30 p-3 rounded border border-primary-500/10">
                <p className="font-medium text-primary-400 mb-1">Admin Access:</p>
                <p>Email: admin@gmail.com</p>
                <p>Password: 12345678</p>
              </div>
              <div className="bg-secondary-700/30 p-3 rounded border border-primary-500/10">
                <p className="font-medium text-primary-400 mb-1">Recruiter Access:</p>
                <p>Email: 123@gmail.com</p>
                <p>Password: 12345678</p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-400 text-sm">
                {"Don't have an account? "}
                <Link
                  href="/register"
                  className="text-primary-500 hover:text-primary-400 transition-colors duration-300 font-medium"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-xs uppercase tracking-widest">Secure Login • Protected by SSL</p>
        </div>
      </div>
    </div>
  )
}
