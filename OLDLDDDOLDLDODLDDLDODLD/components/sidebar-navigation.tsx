"use client"

// #file: sidebar-navigation.tsx
// A collapsible sidebar navigation component with sections for app navigation

import { useState, useCallback } from "react"
import { usePathname, useRouter } from "next/navigation"
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

type MenuSection = {
  id: string
  label: string
  children?: {
    id: string
    label: string 
    path: string
  }[]
}

interface SidebarNavigationProps {
  initialTab?: string
  onTabChange?: (tab: string) => void
  onSettingsClick?: (view?: "user" | "crm" | "billing") => void
}

const MENU_SECTIONS = [
  {
    id: 'find',
    label: 'FIND',
    children: [
      {
        id: 'enrich',
        label: 'Enrich',
        path: '/dashboard/enrichment'
      }
    ]
  },
  {
    id: 'connect',
    label: 'CONNECT',
    children: [
      {
        id: 'contacts',
        label: 'My Contacts', 
        path: '/dashboard/contacts'
      },
      {
        id: 'lists',
        label: 'Contact Lists',
        path: '/dashboard/lists'  
      },
      {
        id: 'autopilot',
        label: 'Autopilot',
        path: '/dashboard/autopilot'
      }
    ]
  },
  {
    id: 'companies',
    label: 'COMPANIES',
    children: [
      {
        id: 'my-companies',
        label: 'My Companies',
        path: '/dashboard/companies'
      },
      {
        id: 'company-lists', 
        label: 'Company Lists',
        path: '/dashboard/company-lists'
      }
    ]
  },
  {
    id: 'tools',
    label: 'TOOLS',
    children: [
      {
        id: 'writer',
        label: 'Writer',
        path: '/dashboard/writer'
      }
    ]
  }
]

export function SidebarNavigation({ initialTab, onTabChange, onSettingsClick }: SidebarNavigationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    contacts: true,
    companies: false
  })

  const handleNavigation = useCallback((path: string) => {
    try {
      router.push(path)
    } catch (error) {
      console.error('Navigation error:', error)
      // Handle navigation error
    }
  }, [router])

  const toggleMenu = useCallback((menuId: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }))
  }, [])

  const isActiveRoute = useCallback((path: string) => {
    return pathname === path
  }, [pathname])

  // Handle 404 and loading states
  if (!pathname) {
    return <div>Loading...</div>
  }

  return (
    <aside 
      className={`${
        isCollapsed ? "w-16" : "w-16 md:w-56"
      } bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0 transition-all duration-200`}
    >
      {/* Logo Section */}
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

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto">
        {MENU_SECTIONS.map((section) => (
          <div key={section.id} className="mt-6 px-2">
            <div 
              className={`text-xs font-medium text-gray-500 px-3 mb-2 ${
                isCollapsed ? "hidden" : "hidden md:block"
              }`}
            >
              {section.label}
            </div>

            {section.children?.map((item) => (
              <button
                key={item.id}
                className={`flex items-center w-full p-2 rounded-md mb-1 ${
                  isActiveRoute(item.path) 
                    ? "bg-blue-50 text-blue-600" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => handleNavigation(item.path)}
              >
                <span className="h-5 w-5 min-w-5">
                  {/* Add icon based on item.id */}
                </span>
                <span className={`ml-3 text-sm ${
                  isCollapsed ? "hidden" : "hidden md:block"
                }`}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer Section */}
      <div className="mt-auto px-2 mb-4">
        <button
          className="flex items-center w-full p-2 rounded-md text-gray-700 hover:bg-gray-100"
          onClick={() => handleNavigation("/settings")}
        >
          <Settings className="h-5 w-5 min-w-5" />
          <span className={`ml-3 text-sm ${
            isCollapsed ? "hidden" : "hidden md:block"
          }`}>
            Settings
          </span>
        </button>

        {/* User Profile */}
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
    </aside>
  )
}

