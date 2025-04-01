import type React from "react"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"
import { SidebarNavigation } from "@/components/sidebar-navigation"
import TopNavigation from "@/components/top-navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "LinkedIn Lead Generation & AI Content Platform",
  description: "Generate leads and create AI-powered content for your outreach campaigns",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <div className="min-h-screen flex flex-col">
            <TopNavigation />
            <div className="flex flex-1">
              <SidebarNavigation />
              <main className="flex-1 ml-16 md:ml-56">
                {children}
              </main>
            </div>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}