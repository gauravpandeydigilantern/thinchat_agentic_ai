"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  MoreVertical,
  Cloud,
  Linkedin,
  Twitter,
  Facebook,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  Plus,
  ChevronDown,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import type { ContactData, ViewMode, TableView } from "@/lib/types"

interface ContactsTableProps {
  data: ContactData[]
  activeTab: "contacts" | "lists" | "company"
  tableView: TableView
  viewMode: ViewMode
  searchQuery: string
  onSearch: (query: string) => void
  currentPage: number
  onPageChange: (page: number) => void
  selectedContacts: string[]
  onSelectContact: (id: string, isSelected: boolean) => void
  onContactClick: (contact: ContactData) => void
  onTableViewChange: (view: TableView) => void
  onViewModeChange: (mode: ViewMode) => void
  onToggleFilterPanel: () => void
  onToggleEnrichmentPanel: () => void
  onAddToList: (event: React.MouseEvent, contactId?: string) => void
  onToggleCrmPanel: () => void
}

export function ContactsTable({
  data,
  activeTab,
  tableView,
  viewMode,
  searchQuery,
  onSearch,
  currentPage,
  onPageChange,
  selectedContacts,
  onSelectContact,
  onContactClick,
  onTableViewChange,
  onViewModeChange,
  onToggleFilterPanel,
  onToggleEnrichmentPanel,
  onAddToList,
  onToggleCrmPanel,
}: ContactsTableProps) {
  const [contactsData, setContactsData] = useState<ContactData[]>([]); // Replace static data with state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContacts() {
      try {
        const response = await fetch("/api/contacts");
        const result = await response.json();
        setContactsData(result);
      } catch (error) {
        console.error("Failed to fetch contacts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchContacts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const [showingResults, setShowingResults] = useState("1 - 1 of 1")
  const [selectAll, setSelectAll] = useState(false)

  // Different column configurations based on the table view
  const getColumns = () => {
    if (tableView === "contact") {
      return [
        { id: "contact", label: "Contact", sortable: true },
        { id: "title", label: "Title", sortable: true },
        { id: "company", label: "Company", sortable: true },
        { id: "website", label: "Website", sortable: true },
        { id: "companyEmails", label: "Company Emails", sortable: true },
        { id: "contactEmails", label: "Contact Emails", sortable: true },
        { id: "companyPhone", label: "Company Phone", sortable: true },
        { id: "actions", label: "Actions", sortable: false },
      ]
    } else if (tableView === "company") {
      return [
        { id: "companyLocation", label: "Company Location", sortable: true },
        { id: "employeeSize", label: "Employee Size", sortable: true },
        { id: "companySocials", label: "Company Socials", sortable: true },
        { id: "aiWriter", label: "AI Writer", sortable: true },
        { id: "dateResearched", label: "Date Researched", sortable: true },
        { id: "lists", label: "Lists", sortable: true },
        { id: "crm", label: "CRM", sortable: true },
        { id: "actions", label: "Actions", sortable: false },
      ]
    } else {
      return [
        { id: "contactSocials", label: "Contact Socials", sortable: true },
        { id: "industry", label: "Industry", sortable: true },
        { id: "contactLocation", label: "Contact Location", sortable: true },
        { id: "seniority", label: "Seniority", sortable: true },
        { id: "department", label: "Department", sortable: true },
        { id: "companyLocation", label: "Company Location", sortable: true },
        { id: "employeeSize", label: "Employee Size", sortable: true },
        { id: "actions", label: "Actions", sortable: false },
      ]
    }
  }

  const columns = getColumns()

  // Render table cell content based on column id and data
  const renderCellContent = (column: { id: string; label: string; sortable: boolean }, item: ContactData) => {
    switch (column.id) {
      case "contact":
        return (
          <button className="text-blue-600 font-medium hover:underline" onClick={() => onContactClick(item)}>
            {item.name}
          </button>
        )
      case "title":
        return item.title
      case "company":
        return (
          <div className="flex items-center">
            <span className="text-gray-700">{item.company}</span>
          </div>
        )
      case "website":
        return (
          <a
            href={`https://${item.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {item.website}
          </a>
        )
      case "companyEmails":
        return (
          <div className="flex items-center">
            <a href={`mailto:${item.companyEmail}`} className="text-blue-600 hover:underline">
              {item.companyEmail}
            </a>
          </div>
        )
      case "contactEmails":
        return (
          <div className="flex items-center">
            <button className="text-blue-600 hover:underline flex items-center">
              <Plus className="h-3 w-3 mr-1" />
              Add Email
            </button>
          </div>
        )
      case "contactSocials":
        return (
          <div className="flex items-center space-x-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a href="#" className="hover:opacity-80">
                    <Linkedin className="h-5 w-5 text-blue-600" />
                  </a>
                </TooltipTrigger>
                <TooltipContent>LinkedIn Profile</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a href="#" className="hover:opacity-80">
                    <Twitter className="h-5 w-5 text-blue-400" />
                  </a>
                </TooltipTrigger>
                <TooltipContent>Twitter Profile</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a href="#" className="hover:opacity-80">
                    <Facebook className="h-5 w-5 text-blue-800" />
                  </a>
                </TooltipTrigger>
                <TooltipContent>Facebook Profile</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a href="#" className="hover:opacity-80">
                    <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="text-xs">G</span>
                    </div>
                  </a>
                </TooltipTrigger>
                <TooltipContent>Google Profile</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )
      case "industry":
        return (
          <div className="flex items-center">
            <span>{item.industry}</span>
            <Badge variant="outline" className="ml-2 bg-gray-100">
              +1
            </Badge>
          </div>
        )
      case "contactLocation":
        return item.location
      case "seniority":
        return (
          <Badge variant="outline" className="bg-gray-100">
            {item.seniority}
          </Badge>
        )
      case "department":
        return (
          <Badge variant="outline" className="bg-gray-100">
            {item.department}
          </Badge>
        )
      case "companyLocation":
        return item.companyLocation
      case "employeeSize":
        return item.employeeSize
      case "companySocials":
        return (
          <div className="flex items-center space-x-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a href="#" className="hover:opacity-80">
                    <Linkedin className="h-5 w-5 text-blue-600" />
                  </a>
                </TooltipTrigger>
                <TooltipContent>Company LinkedIn</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a href="#" className="hover:opacity-80">
                    <Twitter className="h-5 w-5 text-blue-400" />
                  </a>
                </TooltipTrigger>
                <TooltipContent>Company Twitter</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a href="#" className="hover:opacity-80">
                    <Facebook className="h-5 w-5 text-blue-800" />
                  </a>
                </TooltipTrigger>
                <TooltipContent>Company Facebook</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a href="#" className="hover:opacity-80">
                    <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="text-xs">G</span>
                    </div>
                  </a>
                </TooltipTrigger>
                <TooltipContent>Company Google</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )
      case "aiWriter":
        return <div className="text-blue-600">AI Writer</div>
      case "dateResearched":
        return "3 minutes ago"
      case "lists":
        return (
          <button className="text-blue-600 hover:underline flex items-center" onClick={(e) => onAddToList(e, item.id)}>
            <Plus className="h-3 w-3 mr-1" />
            Add to list
          </button>
        )
      case "crm":
        return (
          <div className="flex items-center">
            <button className="text-blue-600 hover:underline flex items-center" onClick={onToggleCrmPanel}>
              <Cloud className="h-4 w-4 mr-1" />
              Connect CRM
            </button>
          </div>
        )
      case "actions":
        return (
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={onToggleCrmPanel}>
                    <Cloud className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Connect to CRM</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={(e) => onAddToList(e, item.id)}>
                    <List className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add to List</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onContactClick(item)}>View Details</DropdownMenuItem>
                <DropdownMenuItem>Edit Contact</DropdownMenuItem>
                <DropdownMenuItem onClick={onToggleEnrichmentPanel}>Enrich Data</DropdownMenuItem>
                <DropdownMenuItem>Export Contact</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">Delete Contact</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      default:
        return null
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value)
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    onPageChange(currentPage + 1)
  }

  const handleCheckboxChange = (id: string, checked: boolean) => {
    onSelectContact(id, checked)
  }

  const handleSelectAllChange = (checked: boolean) => {
    setSelectAll(checked)
    if (checked) {
      onSelectContact("all", true)
      contactsData.forEach((item) => onSelectContact(item.id, true))
    } else {
      contactsData.forEach((item) => onSelectContact(item.id, false))
    }
  }

  const handleViewChange = (view: TableView) => {
    onTableViewChange(view)
  }

  return (
    <div className="flex flex-col flex-1 bg-white">
      <div className="p-4 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleNextPage}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input placeholder="Search" className="pl-9 h-8 w-60" value={searchQuery} onChange={handleSearchChange} />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <Filter className="h-4 w-4 mr-2" />
                <span>Showing {showingResults}</span>
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowingResults("1 - 10 of 10")}>Show 10 per page</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowingResults("1 - 25 of 25")}>Show 25 per page</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowingResults("1 - 50 of 50")}>Show 50 per page</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowingResults("1 - 100 of 100")}>Show 100 per page</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center space-x-1 border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8 rounded-none"
              onClick={() => onViewModeChange("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8 rounded-none"
              onClick={() => onViewModeChange("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onToggleFilterPanel}>
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onToggleEnrichmentPanel}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Enrich Selected Data
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                Export Selected
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Upload className="h-4 w-4 mr-2" />
                Import Contacts
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table View Tabs */}
      {activeTab === "contacts" && (
        <div className="border-b border-gray-200 px-4">
          <div className="flex space-x-4">
            <button
              className={`py-2 px-1 ${tableView === "contact" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
              onClick={() => handleViewChange("contact")}
            >
              Contact View
            </button>
            <button
              className={`py-2 px-1 ${tableView === "social" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
              onClick={() => handleViewChange("social")}
            >
              Social View
            </button>
            <button
              className={`py-2 px-1 ${tableView === "company" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
              onClick={() => handleViewChange("company")}
            >
              Company View
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-y border-gray-200">
              <th className="w-10 px-4 py-3 text-left">
                <Checkbox checked={selectAll} onCheckedChange={handleSelectAllChange} />
              </th>
              {columns.map((column) => (
                <th key={column.id} className="px-4 py-3 text-left font-medium text-gray-600 text-sm">
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && <ChevronDown className="h-4 w-4" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {contactsData.length > 0 ? (
              contactsData.map((item) => (
                <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="w-10 px-4 py-4">
                    <Checkbox
                      checked={selectedContacts.includes(item.id)}
                      onCheckedChange={(checked) => handleCheckboxChange(item.id, checked as boolean)}
                    />
                  </td>
                  {columns.map((column) => (
                    <td key={`${item.id}-${column.id}`} className="px-4 py-4">
                      {renderCellContent(column, item)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-8 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="rounded-full bg-gray-100 p-4">
                      <Search className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium">End of Results</h3>
                    <p className="text-sm text-gray-500 max-w-md">
                      Find more Contacts from our search in the left navigation, or simply click on one of our search
                      starters.
                    </p>
                    <Button>Reset all Filters</Button>
                  </div>
                  <div className="mt-8 flex items-center justify-center">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>Show me contacts who are</span>
                      <Badge variant="outline" className="bg-gray-100">
                        Senior
                      </Badge>
                      <span>in</span>
                      <Badge variant="outline" className="bg-gray-100">
                        Finance
                      </Badge>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="border-t border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={currentPage === 1}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <div className="flex items-center space-x-1">
            <Button variant="default" size="sm" className="h-8 w-8">
              {currentPage}
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={handleNextPage}>
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Jump to page:</span>
          <Input className="h-8 w-16" value={currentPage} onChange={(e) => onPageChange(Number(e.target.value))} />
        </div>
      </div>
    </div>
  )
}

