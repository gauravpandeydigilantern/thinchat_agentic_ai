import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-blue-600">LeadGen AI</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-blue-600">Sign up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900">Generate Leads and Content with AI</h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
            Find your ideal customers and create personalized outreach content with our AI-powered platform.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/auth/signup">
              <Button className="bg-blue-600 px-8 py-6 text-lg">Get Started</Button>
            </Link>
            <Button variant="outline" className="px-8 py-6 text-lg">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Key Features</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="mb-4 inline-flex rounded-full bg-blue-100 p-3 text-blue-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold">Lead Generation</h3>
              <p className="text-gray-600">
                Find and verify contact information for your ideal prospects from LinkedIn and other sources.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="mb-4 inline-flex rounded-full bg-blue-100 p-3 text-blue-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <path d="M16 13H8" />
                  <path d="M16 17H8" />
                  <path d="M10 9H8" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold">AI Content Creation</h3>
              <p className="text-gray-600">
                Generate personalized outreach messages, emails, and social content with our AI writer.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="mb-4 inline-flex rounded-full bg-blue-100 p-3 text-blue-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold">CSV Upload & Enrichment</h3>
              <p className="text-gray-600">
                Upload your existing contact lists and enrich them with additional data points.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold">Ready to grow your business?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg">
            Join thousands of sales professionals who use our platform to find leads and close deals faster.
          </p>
          <Link href="/auth/signup">
            <Button className="bg-white px-8 py-6 text-lg text-blue-600 hover:bg-gray-100">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 text-lg font-bold">LeadGen AI</h3>
              <p className="text-gray-600">
                AI-powered lead generation and content creation platform for sales professionals.
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-bold">Product</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Features</li>
                <li>Pricing</li>
                <li>Integrations</li>
                <li>Roadmap</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-bold">Resources</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Blog</li>
                <li>Documentation</li>
                <li>Guides</li>
                <li>Support</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-bold">Company</h3>
              <ul className="space-y-2 text-gray-600">
                <li>About</li>
                <li>Careers</li>
                <li>Contact</li>
                <li>Legal</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t pt-8 text-center text-gray-600">
            <p>© 2025 LeadGen AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

