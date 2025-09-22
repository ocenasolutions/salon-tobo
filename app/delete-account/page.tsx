"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertTriangle, ArrowLeft, Shield, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function DeleteAccountPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleDeleteAccount = async () => {
    if (!email || !password) {
      setError("Please enter both email and password")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const loginResponse = await fetch("https://husn-app-backend.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const loginData = await loginResponse.json()

      if (!loginData.success) {
        setError(loginData.message || "Invalid email or password")
        return
      }

      const deleteResponse = await fetch("https://husn-app-backend.onrender.com/api/auth/delete-account", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${loginData.tokens.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      })

      const deleteData = await deleteResponse.json()

      if (deleteData.success) {
        // Account deleted successfully
        alert("Your account has been permanently deleted. You will be redirected to the homepage.")
        window.location.href = "/"
      } else {
        setError(deleteData.message || "Failed to delete account")
      }
    } catch (error) {
      console.error("Delete account error:", error)
      setError("An error occurred while deleting your account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <header className="border-b border-white/20 backdrop-blur-md bg-white/80 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative">
              <Image
                src="/HUSN.png"
                alt="HUSN Logo"
                width={44}
                height={44}
                className="rounded-full object-cover shadow-lg ring-2 ring-purple-200"
                priority
              />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full shadow-sm"></div>
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                HUSN
              </span>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">Beauty Management</p>
            </div>
          </Link>
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Trash2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">Delete Your Account</h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              We're sorry to see you go. Please confirm your decision below.
            </p>
          </div>

          {/* Warning Card */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-red-50 to-pink-50 mb-8">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-red-800 mb-3">Important: This action cannot be undone</h3>
                  <ul className="text-red-700 space-y-2 leading-relaxed">
                    <li>• All your account data will be permanently deleted</li>
                    <li>• Your booking history and client information will be lost</li>
                    <li>• Any active subscriptions will be cancelled</li>
                    <li>• You will not be able to recover your account</li>
                    <li>• All associated data including bills, expenses, and analytics will be removed</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verification Form */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl font-semibold text-slate-800">Verify Your Identity</CardTitle>
              <p className="text-slate-600">Please enter your email and password to confirm account deletion</p>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 text-lg"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700 font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 text-lg"
                    disabled={isLoading}
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      className="w-full h-12 text-lg bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 shadow-lg"
                      disabled={isLoading || !email || !password}
                    >
                      {isLoading ? "Processing..." : "Delete My Account"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-center">Final Confirmation</AlertDialogTitle>
                      <AlertDialogDescription className="text-center">
                        Are you absolutely sure you want to delete your account? This action is permanent and cannot be
                        reversed.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                      <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
                        disabled={isLoading}
                      >
                        {isLoading ? "Deleting..." : "Yes, Delete Forever"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>

          {/* Support Section */}
          <div className="text-center mt-8 p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Need Help?</h3>
            <p className="text-slate-600 mb-4">
              If you're having issues with your account, our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" asChild>
                <Link href="mailto:support@husn.com">Contact Support</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/help">View FAQ</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
