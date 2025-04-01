"use client"

import { useState } from "react"
import { AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"

interface EmailVerificationAlertProps {
  userEmail: string
}

export function EmailVerificationAlert({ userEmail }: EmailVerificationAlertProps) {
  const [dismissed, setDismissed] = useState(false)
  const [isResending, setIsResending] = useState(false)

  if (dismissed) {
    return null
  }

  const handleResendVerification = async () => {
    setIsResending(true)

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to resend verification email")
      }

      toast({
        title: "Verification email sent",
        description: "Please check your inbox to verify your email address",
      })
    } catch (error) {
      console.error("Error resending verification:", error)
      toast({
        variant: "destructive",
        title: "Failed to resend verification email",
        description: error instanceof Error ? error.message : "Please try again later",
      })
    } finally {
      setIsResending(false)
    }
  }

  return (
    <Alert className="bg-amber-50 border-amber-200 mb-4">
      <AlertCircle className="h-4 w-4 text-amber-600" />
      <AlertDescription className="flex items-center justify-between w-full">
        <div className="text-amber-800">
          Your email is not verified. Please check your inbox or{" "}
          <Button
            variant="link"
            className="p-0 h-auto text-amber-800 underline"
            onClick={handleResendVerification}
            disabled={isResending}
          >
            {isResending ? "Sending..." : "resend verification email"}
          </Button>
        </div>
        <Button variant="ghost" size="sm" className="text-amber-800 h-6 w-6 p-0" onClick={() => setDismissed(true)}>
          <X className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  )
}

