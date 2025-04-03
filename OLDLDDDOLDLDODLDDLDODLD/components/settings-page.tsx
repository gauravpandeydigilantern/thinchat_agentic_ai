"use client"

import { useState } from "react"
import { Users, CreditCard, SettingsIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SettingsPageProps {
  view: "user" | "crm" | "billing"
  onViewChange: (view: "user" | "crm" | "billing") => void
  onClose: () => void
}

export function SettingsPage({ view, onViewChange, onClose }: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState(view)

  const handleTabChange = (tab: "user" | "crm" | "billing") => {
    setActiveTab(tab)
    onViewChange(tab)
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="flex h-full">
        <div className="w-64 border-r border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <SettingsIcon className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold">Settings</h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">User Settings</h3>
              <div className="space-y-1">
                <button
                  className={`w-full text-left px-3 py-2 rounded-md ${activeTab === "user" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"}`}
                  onClick={() => handleTabChange("user")}
                >
                  Setup
                </button>
                <button className="w-full text-left px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                  My Account
                </button>
                <button className="w-full text-left px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                  Affiliate
                </button>
                <button className="w-full text-left px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                  Downloads
                </button>
                <button className="w-full text-left px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                  Archive
                </button>
                <button className="w-full text-left px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                  Seamless Labs
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Company Settings</h3>
              <div className="space-y-1">
                <button className="w-full text-left px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                  User Management
                </button>
                <button
                  className={`w-full text-left px-3 py-2 rounded-md ${activeTab === "billing" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"}`}
                  onClick={() => handleTabChange("billing")}
                >
                  Billing
                </button>
                <button className="w-full text-left px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                  Single Sign On
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">CRM Settings</h3>
              <div className="space-y-1">
                <button
                  className={`w-full text-left px-3 py-2 rounded-md ${activeTab === "crm" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"}`}
                  onClick={() => handleTabChange("crm")}
                >
                  CRM Setup
                </button>
                <button className="w-full text-left px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                  Integrations
                </button>
                <button className="w-full text-left px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                  Custom Data Rules
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === "user" && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">User Management</h2>
              <div className="bg-white border rounded-md p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Organization</h3>
                  <div className="flex items-center">
                    <div className="h-6 w-6 rounded-full bg-yellow-400 mr-2"></div>
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  <div className="h-16 w-16 rounded-md bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-medium mr-4">
                    DJK
                  </div>
                  <div>
                    <div className="text-lg font-medium">digilantern | kamal.kishor@digilantern.in's Organization</div>
                    <button className="text-blue-600 text-sm">Change name</button>
                    <div className="text-gray-600 mt-1">kamal.kishor@digilantern.in (Owner)</div>
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <div></div>
                  <div className="flex space-x-2">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Users className="h-4 w-4 mr-2" />
                      Invite New Members
                    </Button>
                    <Button variant="outline">Copy Invite Link</Button>
                  </div>
                </div>
              </div>

              <div className="bg-white border rounded-md p-6">
                <h3 className="text-lg font-medium mb-4">Available Products</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="border rounded-md p-4">
                    <div className="flex items-center mb-4">
                      <div className="h-8 w-8 bg-gray-100 rounded-md mr-2"></div>
                      <h4 className="font-medium">Leads</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Users:</span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">0 Available</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Organization Credits:</span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">0 Available</span>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-md p-4">
                    <div className="flex items-center mb-4">
                      <div className="h-8 w-8 bg-gray-100 rounded-md mr-2"></div>
                      <h4 className="font-medium">Autopilot</h4>
                      <span className="ml-2 px-2 py-0.5 bg-gray-200 text-gray-800 text-xs rounded">Premium</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Users:</span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">0 Available</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Organization Credits:</span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">0 Available</span>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-md p-4">
                    <div className="flex items-center mb-4">
                      <div className="h-8 w-8 bg-gray-100 rounded-md mr-2"></div>
                      <h4 className="font-medium">Enrich</h4>
                      <span className="ml-2 px-2 py-0.5 bg-gray-200 text-gray-800 text-xs rounded">Premium</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Users:</span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">0 Available</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Organization Credits:</span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">0 Available</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "billing" && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Billing</h2>

              <div className="bg-white border rounded-md p-6 mb-6">
                <h3 className="text-lg font-medium mb-4">Subscriptions</h3>
                <p className="text-gray-600 mb-4">You have no current subscriptions</p>

                <Button className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Upgrade Plan
                </Button>

                <p className="text-xs text-gray-500 mt-4">
                  * Next Billing Amount shown here may not include any applicable tax
                </p>
              </div>

              <div className="bg-white border rounded-md p-6">
                <h3 className="text-lg font-medium mb-4">Products</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-md p-4">
                    <div className="flex items-center mb-4">
                      <div className="h-8 w-8 bg-gray-100 rounded-md mr-2"></div>
                      <div>
                        <h4 className="font-medium">Leads - Custom (Free Trial)</h4>
                        <p className="text-sm text-gray-600">Users</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span>Total Users: 1</span>
                        <span>Available Users: 0</span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                          <span>License Credit Amount</span>
                          <span>50</span>
                        </div>
                        <div className="flex justify-between text-sm font-medium">
                          <span>Credit Refresh Period</span>
                          <span>N/A</span>
                        </div>
                        <div className="flex justify-between text-sm font-medium">
                          <span>Next Credit Refresh Date</span>
                          <span>N/A</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-md p-4">
                    <div className="flex items-center mb-4">
                      <div className="h-8 w-8 bg-gray-100 rounded-md mr-2"></div>
                      <div>
                        <h4 className="font-medium">Writer (Free Trial)</h4>
                        <p className="text-sm text-gray-600">Users</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span>Total Users: 1</span>
                        <span>Available Users: 0</span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                          <span>License Credit Amount</span>
                          <span>5</span>
                        </div>
                        <div className="flex justify-between text-sm font-medium">
                          <span>Credit Refresh Period</span>
                          <span>N/A</span>
                        </div>
                        <div className="flex justify-between text-sm font-medium">
                          <span>Next Credit Refresh Date</span>
                          <span>N/A</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "crm" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">CRM Setup</h2>
                <Button variant="outline">Get On-Demand Training</Button>
              </div>

              <div className="flex justify-between mb-6">
                <div></div>
                <div className="flex space-x-4">
                  <a href="#" className="text-blue-600">
                    View our Integration Guides
                  </a>
                  <span className="text-gray-300">|</span>
                  <a href="#" className="text-blue-600">
                    Request a New Integration
                  </a>
                </div>
              </div>

              <div className="bg-white border rounded-md p-6 mb-6">
                <h3 className="text-xl font-medium text-blue-600 mb-4">Connect ThinkChat.AI Directly To Your CRM</h3>
                <p className="text-gray-600 mb-6">
                  You current don't have any integrations set up with ThinkChat.AI. Please connect your first app to
                  begin your CRM setup.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="border rounded-md p-4 flex flex-col items-center">
                    <div className="h-16 w-16 mb-4">
                      <img src="/placeholder.svg?height=64&width=64" alt="Chrome" className="w-full h-full" />
                    </div>
                    <h4 className="font-medium mb-2">Install Chrome Extension</h4>
                    <div className="mt-auto">
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">✓ Connected</span>
                    </div>
                  </div>

                  <div className="border rounded-md p-4 flex flex-col items-center">
                    <div className="h-16 w-16 mb-4">
                      <img src="/placeholder.svg?height=64&width=64" alt="Salesforce" className="w-full h-full" />
                    </div>
                    <h4 className="font-medium mb-2">Add to Salesforce</h4>
                    <Button className="mt-auto">Connect</Button>
                  </div>

                  <div className="border rounded-md p-4 flex flex-col items-center">
                    <div className="h-16 w-16 mb-4">
                      <img src="/placeholder.svg?height=64&width=64" alt="Hubspot" className="w-full h-full" />
                    </div>
                    <h4 className="font-medium mb-2">Add to Hubspot</h4>
                    <Button className="mt-auto">Connect</Button>
                  </div>

                  <div className="border rounded-md p-4 flex flex-col items-center">
                    <div className="h-16 w-16 mb-4">
                      <img src="/placeholder.svg?height=64&width=64" alt="Mixmax" className="w-full h-full" />
                    </div>
                    <h4 className="font-medium mb-2">Add to Mixmax</h4>
                    <Button className="mt-auto">Connect</Button>
                  </div>

                  <div className="border rounded-md p-4 flex flex-col items-center">
                    <div className="h-16 w-16 mb-4">
                      <img
                        src="/placeholder.svg?height=64&width=64"
                        alt="Microsoft Dynamics"
                        className="w-full h-full"
                      />
                    </div>
                    <h4 className="font-medium mb-2">Add to Microsoft Dynamics</h4>
                    <Button className="mt-auto">Connect</Button>
                  </div>

                  <div className="border rounded-md p-4 flex flex-col items-center">
                    <div className="h-16 w-16 mb-4">
                      <img src="/placeholder.svg?height=64&width=64" alt="Zoho CRM" className="w-full h-full" />
                    </div>
                    <h4 className="font-medium mb-2">Add to Zoho CRM</h4>
                    <Button className="mt-auto">Connect</Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

