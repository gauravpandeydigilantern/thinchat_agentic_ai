"use client"

import { MessageSquare, Bell, HelpCircle, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TopNavigationProps {
  creditsAvailable: number
  onIntegrationsClick: () => void
}

export function TopNavigation({ creditsAvailable, onIntegrationsClick }: TopNavigationProps) {
  return (
    <div className="w-full bg-white border-b border-gray-200 px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center">

          {/* <div className="flex items-center mr-8">
            <div className="text-blue-600 font-bold text-xl flex items-center">
              <span className="text-blue-600 mr-1">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                  <path
                    d="M8 12L11 15L16 9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              ThinkChat.AI
            </div>
          </div> */}

          <div className="hidden md:flex space-x-4">
            {/* <Button variant="ghost" className="text-gray-600">
              Join Live Training
            </Button>
            <Button variant="ghost" className="text-gray-600">
              On-Demand Training
            </Button> */}
            <Button variant="ghost" className="text-gray-600" onClick={onIntegrationsClick}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1"
              >
                <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
              </svg>
              Integrations
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" className="hidden md:flex">
            Get a Demo
          </Button>
          <Button className="hidden md:flex bg-blue-600 hover:bg-blue-700">Upgrade Plan</Button>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <MessageSquare className="h-5 w-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="icon">
              <HelpCircle className="h-5 w-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5 text-gray-600" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

