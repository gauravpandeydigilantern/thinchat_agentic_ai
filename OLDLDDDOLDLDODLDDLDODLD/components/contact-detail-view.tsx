"use client"

import { useState } from "react"
import { Linkedin, Twitter, Facebook, MapPin, Download, Trash2, Edit, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ContactData } from "@/lib/types"

interface ContactDetailViewProps {
  contact: ContactData
  onClose: () => void
}

export function ContactDetailView({ contact, onClose }: ContactDetailViewProps) {
  const [activeTab, setActiveTab] = useState("contact")

  return (
    <div className="flex-1 bg-white">
      <div className="border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-xl font-semibold">{contact.name}</div>
          <div className="flex ml-2 space-x-1">
            <a href="#" className="text-blue-600 hover:text-blue-800">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="#" className="text-blue-400 hover:text-blue-600">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-blue-800 hover:text-blue-900">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700">
              <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-xs">G</span>
              </div>
            </a>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="flex items-center">
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button variant="outline" size="sm" className="flex items-center">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex mb-6">
          <div className="mr-4">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-medium">
              {contact.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-medium">{contact.name}</h2>
            <p className="text-gray-600">
              {contact.title} at{" "}
              <a href="#" className="text-blue-600 hover:underline">
                {contact.company}
              </a>
            </p>
            <p className="text-gray-600 flex items-center mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {contact.location}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <Tabs defaultValue="contact">
            <TabsList className="w-full border-b border-gray-200 mb-4">
              <TabsTrigger
                value="contact"
                className={`py-2 px-4 ${activeTab === "contact" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
                onClick={() => setActiveTab("contact")}
              >
                Contact
              </TabsTrigger>
              <TabsTrigger
                value="email"
                className={`py-2 px-4 ${activeTab === "email" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
                onClick={() => setActiveTab("email")}
              >
                Email
              </TabsTrigger>
              <TabsTrigger
                value="phone"
                className={`py-2 px-4 ${activeTab === "phone" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
                onClick={() => setActiveTab("phone")}
              >
                Phone
              </TabsTrigger>
              <TabsTrigger
                value="domain"
                className={`py-2 px-4 ${activeTab === "domain" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
                onClick={() => setActiveTab("domain")}
              >
                Domain
              </TabsTrigger>
              <TabsTrigger
                value="company"
                className={`py-2 px-4 ${activeTab === "company" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
                onClick={() => setActiveTab("company")}
              >
                Company
              </TabsTrigger>
              <TabsTrigger
                value="orgchart"
                className={`py-2 px-4 ${activeTab === "orgchart" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
                onClick={() => setActiveTab("orgchart")}
              >
                Org Chart
              </TabsTrigger>
              <TabsTrigger
                value="location"
                className={`py-2 px-4 ${activeTab === "location" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
                onClick={() => setActiveTab("location")}
              >
                Location
              </TabsTrigger>
              <TabsTrigger
                value="aiwriter"
                className={`py-2 px-4 ${activeTab === "aiwriter" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
                onClick={() => setActiveTab("aiwriter")}
              >
                AI Writer
              </TabsTrigger>
            </TabsList>

            <TabsContent value="contact" className="mt-4">
              <div className="flex">
                <div className="w-2/3 pr-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-4">Contact Details</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Name</div>
                        <div className="font-medium">{contact.name}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Title</div>
                        <div className="font-medium">{contact.title}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Company</div>
                        <div className="font-medium">{contact.company}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Email</div>
                        <a
                          href={`mailto:${contact.companyEmail}`}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          {contact.companyEmail}
                        </a>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Website</div>
                        <a
                          href={`https://${contact.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:underline"
                        >
                          {contact.website}
                        </a>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Location</div>
                        <div className="font-medium">{contact.location}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Professional Information</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Seniority</div>
                        <div className="font-medium">{contact.seniority}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Department</div>
                        <div className="font-medium">{contact.department}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Industry</div>
                        <div className="font-medium">{contact.industry}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-1/3 border-l border-gray-200 pl-6">
                  <h3 className="text-lg font-medium mb-4">Key Contacts at {contact.company}</h3>

                  <div className="space-y-4">
                    <div className="border rounded-md p-3">
                      <div className="flex items-center mb-2">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-medium mr-2">
                          MY
                        </div>
                        <div>
                          <div className="font-medium">Manav Yagnik</div>
                          <div className="text-sm text-gray-600">Co-Founder at {contact.company}</div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        <Search className="h-4 w-4 mr-2" />
                        Find
                      </Button>
                    </div>

                    <div className="border rounded-md p-3">
                      <div className="flex items-center mb-2">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-medium mr-2">
                          DP
                        </div>
                        <div>
                          <div className="font-medium">Dinesh Parekh</div>
                          <div className="text-sm text-gray-600">President at {contact.company}</div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        <Search className="h-4 w-4 mr-2" />
                        Find
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="email">
              <div className="p-6 text-center">
                <div className="text-lg font-medium mb-2">Email Information</div>
                <p className="text-gray-600">Email details will appear here.</p>
              </div>
            </TabsContent>

            <TabsContent value="phone">
              <div className="p-6 text-center">
                <div className="text-lg font-medium mb-2">Phone Information</div>
                <p className="text-gray-600">Phone details will appear here.</p>
              </div>
            </TabsContent>

            <TabsContent value="domain">
              <div className="p-6 text-center">
                <div className="text-lg font-medium mb-2">Domain Information</div>
                <p className="text-gray-600">Domain details will appear here.</p>
              </div>
            </TabsContent>

            <TabsContent value="company">
              <div className="p-6 text-center">
                <div className="text-lg font-medium mb-2">Company Information</div>
                <p className="text-gray-600">Company details will appear here.</p>
              </div>
            </TabsContent>

            <TabsContent value="orgchart">
              <div className="p-6 text-center">
                <div className="text-lg font-medium mb-2">Organization Chart</div>
                <p className="text-gray-600">Organization chart will appear here.</p>
              </div>
            </TabsContent>

            <TabsContent value="location">
              <div className="p-6 text-center">
                <div className="text-lg font-medium mb-2">Location Information</div>
                <p className="text-gray-600">Location details will appear here.</p>
              </div>
            </TabsContent>

            <TabsContent value="aiwriter">
              <div className="p-6 text-center">
                <div className="text-lg font-medium mb-2">AI Writer</div>
                <p className="text-gray-600">AI Writer tools will appear here.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

