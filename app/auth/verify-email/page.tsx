import { EmailVerification } from "@/components/auth/email-verification"

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Verify your email</h1>
          <p className="text-gray-500 mt-2">Enter the code we sent to your email</p>
        </div>

        <EmailVerification />
      </div>
    </div>
  )
}

