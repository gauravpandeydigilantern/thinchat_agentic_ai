"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useLocation } from "wouter"
import { Link } from "wouter"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Search, Bot, Database, ArrowRight } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { motion } from "framer-motion"

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function Login() {
  const [location, setLocation] = useLocation()
  const { login, isLoading } = useAuth()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    const success = await login(data.email, data.password)
    if (success) {
      setLocation("/dashboard")
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Left side - Brand Info */}
      <div className="hidden md:flex md:w-1/3 lg:w-1/2 bg-gradient-to-br from-violet-600 to-indigo-700 text-white flex-col justify-center items-center p-10 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto z-10"
        >
          <div className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-violet-200">
            AI-Powered CRM System
          </div>
          <p className="text-violet-100 mb-10 text-lg">
            Generate real-time B2B leads, get enriched contact data, and send AI-powered personalized outreach messages
            in one place.
          </p>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-start space-x-4"
            >
              <div className="bg-white/15 p-3 rounded-xl shadow-lg backdrop-blur-sm">
                <Search className="text-white" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Real-Time B2B Lead Search</h3>
                <p className="text-violet-100 text-base">
                  Find qualified leads based on industry, job title, and more.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-start space-x-4"
            >
              <div className="bg-white/15 p-3 rounded-xl shadow-lg backdrop-blur-sm">
                <Bot className="text-white" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">AI-Powered Messaging</h3>
                <p className="text-violet-100 text-base">Generate personalized outreach messages with AI assistance.</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex items-start space-x-4"
            >
              <div className="bg-white/15 p-3 rounded-xl shadow-lg backdrop-blur-sm">
                <Database className="text-white" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Data Enrichment</h3>
                <p className="text-violet-100 text-base">Get detailed contact information and company insights.</p>
              </div>
            </motion.div>
          </div>

          <div className="mt-16 text-sm text-violet-200 flex items-center">
            <div className="flex space-x-3 mr-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/70"></div>
              ))}
            </div>
            <p>Trusted by 1000+ businesses worldwide</p>
          </div>
        </motion.div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Welcome back</h2>
                <Link
                  href="/signup"
                  className="text-violet-600 text-sm font-medium hover:text-violet-700 transition-colors"
                >
                  Create account
                </Link>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700">Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your email"
                              type="email"
                              className="h-12 border-slate-200 focus:border-violet-500 focus:ring-violet-500/20"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel className="text-slate-700">Password</FormLabel>
                            <Link
                              href="/forgot-password"
                              className="text-xs text-violet-600 hover:text-violet-700 transition-colors"
                            >
                              Forgot password?
                            </Link>
                          </div>
                          <FormControl>
                            <Input
                              placeholder="Enter your password"
                              type="password"
                              className="h-12 border-slate-200 focus:border-violet-500 focus:ring-violet-500/20"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="pt-4"
                  >
                    <Button
                      type="submit"
                      className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        <>
                          Login
                          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </>
                      )}
                    </Button>
                  </motion.div>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-slate-500">Or continue with</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-12 border-slate-200 hover:bg-slate-50">
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      Google
                    </Button>
                    <Button variant="outline" className="h-12 border-slate-200 hover:bg-slate-50">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                      </svg>
                      Facebook
                    </Button>
                  </div>

                  <div className="text-center mt-6">
                    <p className="text-sm text-slate-600">
                      Don't have an account?{" "}
                      <Link
                        href="/signup"
                        className="text-violet-600 hover:text-violet-700 font-medium transition-colors"
                      >
                        Sign up
                      </Link>
                    </p>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

