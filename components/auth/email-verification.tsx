"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"

export function EmailVerification() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""])
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "success" | "error">("idle")
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(0, 1)
    }

    if (value && /^[0-9]$/.test(value)) {
      const newCode = [...verificationCode]
      newCode[index] = value
      setVerificationCode(newCode)

      // Auto-focus next input
      if (index < 5 && value) {
        const nextInput = document.getElementById(`otp-${index + 1}`)
        if (nextInput) {
          nextInput.focus()
        }
      }
    } else if (value === "") {
      const newCode = [...verificationCode]
      newCode[index] = ""
      setVerificationCode(newCode)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      if (prevInput) {
        prevInput.focus()
      }
    }
  }

  const handleVerify = async () => {
    const code = verificationCode.join("")
    if (code.length !== 6) {
      toast({
        variant: "destructive",
        title: "Invalid code",
        description: "Please enter the 6-digit verification code",
      })
      return
    }

    setIsVerifying(true)

    try {
      // Simulate verification
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setVerificationStatus("success")

      // Redirect after successful verification
      setTimeout(() => {
        router.push("/auth/login?verified=true")
      }, 2000)
    } catch (error) {
      console.error("Verification error:", error)
      setVerificationStatus("error")
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: error instanceof Error ? error.message : "Please try again or request a new code",
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResendCode = async () => {
    setIsResending(true)

    try {
      // Simulate resending code
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Verification code sent",
        description: "A new verification code has been sent to your email",
      })

      // Set cooldown for resend button
      setCountdown(60)
    } catch (error) {
      console.error("Resend error:", error)
      toast({
        variant: "destructive",
        title: "Failed to resend code",
        description: error instanceof Error ? error.message : "Please try again later",
      })
    } finally {
      setIsResending(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Verify your email</CardTitle>
        <CardDescription>
          We've sent a verification code to <span className="font-medium">{email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {verificationStatus === "success" ? (
          <div className="flex flex-col items-center justify-center py-4">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold">Email Verified!</h3>
            <p className="text-gray-500 mt-2 text-center">
              Your email has been successfully verified. Redirecting you to login...
            </p>
          </div>
        ) : verificationStatus === "error" ? (
          <div className="flex flex-col items-center justify-center py-4">
            <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
            <h3 className="text-xl font-semibold">Verification Failed</h3>
            <p className="text-gray-500 mt-2 text-center">
              The verification code is invalid or has expired. Please try again or request a new code.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => setVerificationStatus("idle")}>
              Try Again
            </Button>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center space-y-4">
              <p className="text-sm text-gray-500 mb-2">Enter the 6-digit code sent to your email</p>

              <div className="flex gap-2">
                {verificationCode.map((digit, index) => (
                  <Input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    className="w-12 h-12 text-center text-lg"
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              <Button
                className="w-full bg-blue-600 mt-4"
                onClick={handleVerify}
                disabled={isVerifying || verificationCode.join("").length !== 6}
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Email"
                )}
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Didn't receive the code?{" "}
                {countdown > 0 ? (
                  <span className="text-gray-400">Resend in {countdown}s</span>
                ) : (
                  <Button
                    variant="link"
                    className="p-0 h-auto text-blue-600"
                    onClick={handleResendCode}
                    disabled={isResending || countdown > 0}
                  >
                    {isResending ? "Sending..." : "Resend Code"}
                  </Button>
                )}
              </p>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-500">
          Wrong email?{" "}
          <a href="/auth/signup" className="text-blue-600 hover:underline">
            Go back
          </a>
        </p>
      </CardFooter>
    </Card>
  )
}

