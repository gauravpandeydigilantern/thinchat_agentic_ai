"use client"

import { User, ListChecks, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

interface ContactsHeaderProps {
  activeTab: "contacts" | "lists" | "autopilot" | "companies" | "my-companies" | "company-lists" | "enrich"
  onTabChange: (
    tab: "contacts" | "lists" | "autopilot" | "companies" | "my-companies" | "company-lists" | "enrich",
  ) => void
  onManageList: () => void
  onCreateList: () => void
  creditsAvailable: number
}

export function ContactsHeader({
  activeTab,
  onTabChange,
  onManageList,
  onCreateList,
  creditsAvailable,
}: ContactsHeaderProps) {
  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center space-x-4">
          {activeTab === "contacts" || activeTab === "lists" || activeTab === "autopilot" ? (
            <>
              <button
                className={`flex items-center space-x-2 px-4 py-2 ${
                  activeTab === "contacts" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"
                }`}
                onClick={() => onTabChange("contacts")}
              >
                <User className="h-5 w-5" />
                <span className="font-medium">My Contacts</span>
                <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs">1</span>
              </button>
              <button
                className={`flex items-center space-x-2 px-4 py-2 ${
                  activeTab === "lists" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"
                }`}
                onClick={() => onTabChange("lists")}
              >
                <ListChecks className="h-5 w-5" />
                <span className="font-medium">Contact Lists</span>
                <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs">2</span>
              </button>
              <button
                className={`flex items-center space-x-2 px-4 py-2 ${
                  activeTab === "autopilot" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"
                }`}
                onClick={() => onTabChange("autopilot")}
              >
                <Settings className="h-5 w-5" />
                <span className="font-medium">Autopilot</span>
              </button>
            </>
          ) : activeTab === "companies" || activeTab === "my-companies" || activeTab === "company-lists" ? (
            <>
              <button
                className={`flex items-center space-x-2 px-4 py-2 ${
                  activeTab === "my-companies" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"
                }`}
                onClick={() => onTabChange("my-companies")}
              >
                <User className="h-5 w-5" />
                <span className="font-medium">My Companies</span>
                <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs">0</span>
              </button>
              <button
                className={`flex items-center space-x-2 px-4 py-2 ${
                  activeTab === "company-lists" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"
                }`}
                onClick={() => onTabChange("company-lists")}
              >
                <ListChecks className="h-5 w-5" />
                <span className="font-medium">Company Lists</span>
                <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs">0</span>
              </button>
            </>
          ) : activeTab === "enrich" ? (
            <>
              <button className={`flex items-center space-x-2 px-4 py-2 border-b-2 border-blue-600 text-blue-600`}>
                <Settings className="h-5 w-5" />
                <span className="font-medium">Enrich</span>
              </button>
              <button
                className={`flex items-center space-x-2 px-4 py-2 text-gray-600`}
                onClick={() => onTabChange("contacts")}
              >
                <span className="font-medium">View My Lists</span>
              </button>
              <button className={`flex items-center space-x-2 px-4 py-2 text-gray-600`}>
                <span className="font-medium">Purchase Credits</span>
              </button>
            </>
          ) : null}
        </div>
        <div className="flex items-center space-x-4">
          <div className="rounded-md bg-purple-100 px-3 py-1 text-sm text-purple-700">
            {creditsAvailable} Credits Available
          </div>

          {(activeTab === "contacts" || activeTab === "lists") && (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <span>0% - 100% Confidence</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>0% - 25% Confidence</DropdownMenuItem>
                  <DropdownMenuItem>25% - 50% Confidence</DropdownMenuItem>
                  <DropdownMenuItem>50% - 75% Confidence</DropdownMenuItem>
                  <DropdownMenuItem>75% - 100% Confidence</DropdownMenuItem>
                  <DropdownMenuItem>0% - 100% Confidence</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <span>RR, KKR</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onManageList}>Manage Lists</DropdownMenuItem>
                  <DropdownMenuItem onClick={onCreateList}>Create New List</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button className="bg-blue-600 hover:bg-blue-700" onClick={onCreateList}>
                <span className="mr-1">+</span> Create List
              </Button>
            </>
          )}

          {activeTab === "companies" || activeTab === "my-companies" || activeTab === "company-lists" ? (
            <Button className="bg-blue-600 hover:bg-blue-700">
              <span className="mr-1">+</span> Upload Companies
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

