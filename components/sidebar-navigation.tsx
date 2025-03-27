"use client"

import { useState } from "react"
import {
  Search,
  Target,
  Sparkles,
  Users,
  Building2,
  FileText,
  Video,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react"

interface SidebarNavigationProps {
  activeTab: string
  onTabChange: (tab: any) => void
  onSettingsClick: (view?: "user" | "crm" | "billing") => void
}

export function SidebarNavigation({ activeTab, onTabChange, onSettingsClick }: SidebarNavigationProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState({
    contacts: true,
    companies: activeTab === "companies" || activeTab === "my-companies" || activeTab === "company-lists",
  })

  const toggleMenu = (menu: keyof typeof expandedMenus) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }))
  }

  return (
    <div
      className={`${isCollapsed ? "w-16" : "w-16 md:w-56"} bg-white border-r border-gray-200 flex flex-col transition-all duration-200`}
    >
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className={`text-blue-600 font-bold text-xl ${isCollapsed ? "flex" : "hidden md:flex"} items-center`}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-1"
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path
                d="M8 12L11 15L16 9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className={`${isCollapsed ? "hidden" : "hidden md:inline"}`}>ThinkChat.AI</span>
          </div>
          <div className={`${isCollapsed ? "hidden" : "md:hidden"} text-blue-600`}>
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
        </div>
        <button className="text-gray-500 hidden md:block" onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>

      <div className="mt-4 px-2">
        <div className={`text-xs font-medium text-gray-500 px-3 mb-2 ${isCollapsed ? "hidden" : "hidden md:block"}`}>
          FIND
        </div>
        {/* <button
          className={`flex items-center w-full p-2 rounded-md mb-1 ${activeTab === "search" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"}`}
          onClick={() => onTabChange("search")}
        >
          <Search className="h-5 w-5 min-w-5" />
          <span className={`ml-3 text-sm ${isCollapsed ? "hidden" : "hidden md:block"}`}>Search</span>
        </button>

        <button
          className={`flex items-center w-full p-2 rounded-md mb-1 ${activeTab === "intent" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"}`}
          onClick={() => onTabChange("intent")}
        >
          <Target className="h-5 w-5 min-w-5" />
          <span className={`ml-3 text-sm ${isCollapsed ? "hidden" : "hidden md:block"}`}>Buyer Intent</span>
        </button> */}

        <button
          className={`flex items-center w-full p-2 rounded-md mb-1 ${activeTab === "enrich" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"}`}
          onClick={() => onTabChange("enrich")}
        >
          <Sparkles className="h-5 w-5 min-w-5" />
          <span className={`ml-3 text-sm ${isCollapsed ? "hidden" : "hidden md:block"}`}>Enrich</span>
        </button>
      </div>

      <div className="mt-6 px-2">
        <div className={`text-xs font-medium text-gray-500 px-3 mb-2 ${isCollapsed ? "hidden" : "hidden md:block"}`}>
          CONNECT
        </div>

        {/* Contacts menu with submenu */}
        <div className="relative">
          <button
            className={`flex items-center justify-between w-full p-2 rounded-md mb-1 ${activeTab === "contacts" || activeTab === "lists" || activeTab === "autopilot" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"}`}
            onClick={() => toggleMenu("contacts")}
          >
            <div className="flex items-center">
              <Users className="h-5 w-5 min-w-5" />
              <span className={`ml-3 text-sm ${isCollapsed ? "hidden" : "hidden md:block"}`}>Contacts</span>
            </div>
            {!isCollapsed && (
              <ChevronDown className={`h-4 w-4 transition-transform ${expandedMenus.contacts ? "rotate-180" : ""}`} />
            )}
          </button>

          {!isCollapsed && expandedMenus.contacts && (
            <div className="ml-8 mt-1 space-y-1">
              <button
                className={`w-full text-left px-3 py-1 rounded-md text-sm ${activeTab === "contacts" ? "text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-100"}`}
                onClick={() => onTabChange("contacts")}
              >
                My Contacts
              </button>
              <button
                className={`w-full text-left px-3 py-1 rounded-md text-sm ${activeTab === "lists" ? "text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-100"}`}
                onClick={() => onTabChange("lists")}
              >
                Contact Lists
              </button>
              <button
                className={`w-full text-left px-3 py-1 rounded-md text-sm ${activeTab === "autopilot" ? "text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-100"}`}
                onClick={() => onTabChange("autopilot")}
              >
                Autopilot
              </button>
            </div>
          )}
        </div>

        {/* Companies menu with submenu */}
        <div className="relative">
          <button
            className={`flex items-center justify-between w-full p-2 rounded-md mb-1 ${activeTab === "companies" || activeTab === "my-companies" || activeTab === "company-lists" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"}`}
            onClick={() => toggleMenu("companies")}
          >
            <div className="flex items-center">
              <Building2 className="h-5 w-5 min-w-5" />
              <span className={`ml-3 text-sm ${isCollapsed ? "hidden" : "hidden md:block"}`}>Companies</span>
            </div>
            {!isCollapsed && (
              <ChevronDown className={`h-4 w-4 transition-transform ${expandedMenus.companies ? "rotate-180" : ""}`} />
            )}
          </button>

          {!isCollapsed && expandedMenus.companies && (
            <div className="ml-8 mt-1 space-y-1">
              <button
                className={`w-full text-left px-3 py-1 rounded-md text-sm ${activeTab === "my-companies" ? "text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-100"}`}
                onClick={() => onTabChange("my-companies")}
              >
                My Companies
              </button>
              <button
                className={`w-full text-left px-3 py-1 rounded-md text-sm ${activeTab === "company-lists" ? "text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-100"}`}
                onClick={() => onTabChange("company-lists")}
              >
                Company Lists
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 px-2">
        <div className={`text-xs font-medium text-gray-500 px-3 mb-2 ${isCollapsed ? "hidden" : "hidden md:block"}`}>
          TOOLS
        </div>
        {/* <button
          className={`flex items-center w-full p-2 rounded-md mb-1 ${activeTab === "academy" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"}`}
          onClick={() => onTabChange("academy")}
        >
          <Video className="h-5 w-5 min-w-5" />
          <span className={`ml-3 text-sm ${isCollapsed ? "hidden" : "hidden md:block"}`}>Academy</span>
        </button> */}

        <button
          className={`flex items-center w-full p-2 rounded-md mb-1 ${activeTab === "writer" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"}`}
          onClick={() => onTabChange("writer")}
        >
          <FileText className="h-5 w-5 min-w-5" />
          <span className={`ml-3 text-sm ${isCollapsed ? "hidden" : "hidden md:block"}`}>Writer</span>
        </button>
      </div>

      <div className="mt-auto px-2 mb-4">
        <button
          className="flex items-center w-full p-2 rounded-md text-gray-700 hover:bg-gray-100"
          onClick={() => onSettingsClick()}
        >
          <Settings className="h-5 w-5 min-w-5" />
          <span className={`ml-3 text-sm ${isCollapsed ? "hidden" : "hidden md:block"}`}>Settings</span>
        </button>

        <div className="flex items-center p-2 mt-4">
          <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-medium">
            KD
          </div>
          <div className={`ml-3 ${isCollapsed ? "hidden" : "hidden md:block"}`}>
            <div className="text-sm font-medium">Kamal Digilantern</div>
            <div className="text-xs text-gray-500">Free Trial</div>
          </div>
        </div>
      </div>
    </div>
  )
}

