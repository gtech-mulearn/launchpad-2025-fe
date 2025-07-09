"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, LogIn, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate loading delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check credentials
    if (email === "admin@gmail.com" && password === "12345678") {
      // Admin login
      localStorage.setItem("userRole", "admin")
      localStorage.setItem("userEmail", email)
      router.push("/dashboard/admin")
    } else if (email === "123@gmail.com" && password === "12345678") {
      // Recruiter login
      localStorage.setItem("userRole", "recruiter")
      localStorage.setItem("userEmail", email)
      router.push("/dashboard/recruiter")
    } else if (email === "company@gmail.com" && password === "12345678") {
      // Recruiter login
      localStorage.setItem("userRole", "company")
      localStorage.setItem("userEmail", email)
      router.push("/dashboard/company")
    } else {
      setError("Invalid email or password. Please try again.")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md relative flex flex-col items-center">
        {/* Back to Home Button */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center text-white hover:text-primary-500 transition-colors duration-300 z-20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="text-sm uppercase tracking-widest">Back to Home</span>
        </Link>
        <Card className="bg-secondary-800/50 backdrop-blur-md border border-primary-500/20 shadow-2xl w-full">
          <CardHeader className="space-y-1 text-center">
            <div className="flex items-center justify-center mb-4">
              <img src="/images/logo.webp" alt="Launchpad Kerala Logo" className="h-12 w-auto" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
            <CardDescription className="text-gray-400">Sign in to your Launchpad Kerala account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <Link href="/register/company" className="text-primary-500 hover:text-primary-400 transition-colors">
                  Register here
                </Link>
              </p>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-secondary-700/30 rounded-lg border border-primary-500/20">
              <h4 className="text-sm font-medium text-white mb-2">Demo Credentials:</h4>
              <div className="space-y-1 text-xs text-gray-400">
                <p>
                  <strong className="text-primary-400">Admin:</strong> admin@gmail.com / 12345678
                </p>
                <p>
                  <strong className="text-blue-400">Recruiter:</strong> 123@gmail.com / 12345678
                </p>
                <p>
                  <strong className="text-blue-400">Company:</strong> company@gmail.com / 12345678
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
