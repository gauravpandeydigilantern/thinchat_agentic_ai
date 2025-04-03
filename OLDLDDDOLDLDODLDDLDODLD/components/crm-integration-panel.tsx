"use client"

import { X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface CrmIntegrationPanelProps {
  onClose: () => void
}

export function CrmIntegrationPanel({ onClose }: CrmIntegrationPanelProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const crmOptions = [
    { id: "salesforce", name: "Salesforce", icon: "/placeholder.svg?height=40&width=40", color: "#00A1E0" },
    { id: "hubspot", name: "Hubspot", icon: "/placeholder.svg?height=40&width=40", color: "#FF7A59" },
    { id: "outreach", name: "Outreach", icon: "/placeholder.svg?height=40&width=40", color: "#6B4FBB" },
    { id: "mixmax", name: "Mixmax", icon: "/placeholder.svg?height=40&width=40", color: "#7F4FBB" },
    { id: "msdynamics", name: "MS Dynamics", icon: "/placeholder.svg?height=40&width=40", color: "#0078D4" },
    { id: "pipedrive", name: "Pipedrive", icon: "/placeholder.svg?height=40&width=40", color: "#26C281" },
    { id: "salesloft", name: "Salesloft", icon: "/placeholder.svg?height=40&width=40", color: "#00BF6F" },
    { id: "insightly", name: "Insightly", icon: "/placeholder.svg?height=40&width=40", color: "#FF3C41" },
  ]

  const filteredCrms = crmOptions.filter((crm) => crm.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl h-[80vh] flex overflow-hidden">
        <div className="w-1/2 p-6 border-r border-gray-200 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="text-blue-600 font-bold text-xl flex items-center mr-2">
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
              </div>
              <span className="font-bold text-xl">ThinkChat.AI</span>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-1">Add To CRM</h2>
            <div className="flex items-center text-green-600 font-medium">
              <span>+20 credits</span>
            </div>
            <p className="text-gray-600 mt-4">
              No more bouncing back and forth between your favourite tools. Import B2b contact and company information
              directly to your existing tech stack in a single-click.
            </p>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search"
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-4 max-h-[calc(80vh-240px)] overflow-y-auto">
            {filteredCrms.map((crm) => (
              <div key={crm.id} className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center">
                  <div
                    className="w-10 h-10 rounded-md flex items-center justify-center mr-3"
                    style={{ backgroundColor: crm.color }}
                  >
                    <img src={crm.icon || "/placeholder.svg"} alt={crm.name} className="w-6 h-6" />
                  </div>
                  <span className="font-medium">{crm.name}</span>
                </div>
                <Button className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50">+ Add</Button>
              </div>
            ))}
          </div>
        </div>

        <div className="w-1/2 bg-blue-600 text-white p-6 flex flex-col">
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <h2 className="text-4xl font-bold mb-4">Supercharge Your Tech Stack</h2>
            <h3 className="text-2xl font-bold mb-8">
              <span className="text-white">Seamlessly Integrate All Your </span>
              <span className="text-yellow-300">Favorite Tools</span>
            </h3>

            <div className="relative w-full h-64 mt-8">
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/10 rounded-full w-32 h-32 flex items-center justify-center">
                <div className="bg-blue-500 rounded-full w-24 h-24 flex items-center justify-center">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="11" cy="11" r="8" stroke="white" strokeWidth="2" />
                    <path d="M21 21L16.65 16.65" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              {/* Placeholder for integration icons */}
              <div className="absolute right-10 top-10 bg-white rounded-lg w-12 h-12"></div>
              <div className="absolute right-20 top-20 bg-white rounded-lg w-12 h-12"></div>
              <div className="absolute right-30 bottom-10 bg-white rounded-lg w-12 h-12"></div>
              <div className="absolute left-10 top-20 bg-white rounded-lg w-12 h-12"></div>
              <div className="absolute left-20 bottom-20 bg-white rounded-lg w-12 h-12"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

