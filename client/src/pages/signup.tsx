"use client"

import { Link } from "wouter"
import MultiStepSignup from "@/components/auth/MultiStepSignup"
import { Search, Bot, Database, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

export default function Signup() {
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

          <div className="mt-16">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="text-violet-300" size={20} />
                <p className="text-white">Free 14-day trial</p>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="text-violet-300" size={20} />
                <p className="text-white">No credit card required</p>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="text-violet-300" size={20} />
                <p className="text-white">Cancel anytime</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right side - Signup Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">Create your account</h2>
              <Link
                href="/login"
                className="text-violet-600 text-sm font-medium hover:text-violet-700 transition-colors"
              >
                Sign in
              </Link>
            </div>
            <p className="text-slate-500 mb-8">Start your 14-day free trial. No credit card required.</p>

            <MultiStepSignup />

            <div className="mt-6 text-center">
              <p className="text-xs text-slate-500">
                By signing up, you agree to our{" "}
                <Link href="/terms" className="text-violet-600 hover:text-violet-700 underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-violet-600 hover:text-violet-700 underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

