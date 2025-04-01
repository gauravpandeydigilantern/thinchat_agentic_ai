"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { TopNavigation } from "@/components/top-navigation"
import { ContactsHeader } from "@/components/contacts-header"
import { ContactsTable } from "@/components/contacts-table"
import { ManageListModal } from "@/components/manage-list-modal"
import { CreateListModal } from "@/components/create-list-modal"
import { AddToListDropdown } from "@/components/add-to-list-dropdown"
import { ContactDetailsPanel } from "@/components/contact-details-panel"
import { DataEnrichmentPanel } from "@/components/data-enrichment-panel"
import { FilterPanel } from "@/components/filter-panel"
import { CrmIntegrationPanel } from "@/components/crm-integration-panel"
import { SettingsPage } from "@/components/settings-page"
import { SidebarNavigation } from "@/components/sidebar-navigation"
import { EnrichView } from "@/components/enrich-view"
import { ViewMyLists } from "@/components/view-my-lists"
import { contactsData } from "@/lib/sample-data"
import type { ContactData, ViewMode, TableView, List } from "@/lib/types"
import { UploadCsvModal } from "@/components/upload-csv-modal"
import { UploadSuccessModal } from "@/components/upload-success-modal"
import WriterPage from "@/app/dashboard/writer/page"
import { leadsService } from "@/services/lead-service"

export function CrmDashboard() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_API || "";
  const [isManageListOpen, setIsManageListOpen] = useState(false)
  const [isCreateListOpen, setIsCreateListOpen] = useState(false)
  const [isAddToListOpen, setIsAddToListOpen] = useState(false)
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false)
  const [isEnrichmentPanelOpen, setIsEnrichmentPanelOpen] = useState(false)
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false)
  const [isCrmPanelOpen, setIsCrmPanelOpen] = useState(false)
  const [isUploadCsvModalOpen, setIsUploadCsvModalOpen] = useState(false)
  const [isUploadSuccessModalOpen, setIsUploadSuccessModalOpen] = useState(false)
  const [uploadType, setUploadType] = useState<"contact" | "company" | "email">("contact")
  const [activeTab, setActiveTab] = useState<
    "contacts" | "lists" | "autopilot" | "companies" | "my-companies" | "company-lists" | "enrich" | "view-lists" | "writer"
  >("contacts")
  const [tableView, setTableView] = useState<TableView>("contact")
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [activeContact, setActiveContact] = useState<ContactData | null>(null)
  const [addToListPosition, setAddToListPosition] = useState({ x: 0, y: 0 })
  const [settingsView, setSettingsView] = useState<"user" | "crm" | "billing">("user")
  const [showSettings, setShowSettings] = useState(false)
  const [uploadedFileName, setUploadedFileName] = useState("")
  const [lists, setLists] = useState<List[]>([
    {
      id: "1",
      name: "RR",
      isDefault: true,
      contactCount: 1,
      dateResearched: "17 hours ago",
      owner: "Kamal Digilantern",
    },
    {
      id: "2",
      name: "KKR",
      isDefault: true,
      contactCount: 0,
      dateResearched: "a month ago",
      owner: "Kamal Digilantern",
    },
  ])

  const [filters, setFilters] = useState({
    seniority: [],
    department: [],
    location: [],
    employeeSize: [],
  })

  interface StatisticsResponse {
    data: Array<{
      id: number;
      account_id: number;
      type: string;
      first_name: string | null;
      last_name: string | null;
      company?: string | null;
    }>;
    count: number;
  }

  const [statistics, useContactData] = useState<StatisticsResponse>({
    data: [],
    count: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      const [statistics] = await Promise.all([
        leadsService.fetchDataThroughBaseUrl(
          process.env.NEXT_PUBLIC_API_BASE_URL || "",
          "/account?type=mycontact"
        ),
      ]);
      useContactData(statistics);
    };

    fetchData();
  }, []);

  useEffect(() => {
    // If a list was successfully uploaded, add it to the lists
    if (isUploadSuccessModalOpen && uploadedFileName) {
      const newList: List = {
        id: (lists.length + 1).toString(),
        name: uploadedFileName,
        isDefault: false,
        contactCount: 1,
        dateResearched: "just now",
        owner: "Kamal Digilantern",
      }
      setLists((prev) => [...prev, newList])
    }
  }, [isUploadSuccessModalOpen, uploadedFileName])

  const filteredContacts = statistics.data.filter((contact) => {
    if (searchQuery) {
      const name = `${contact.first_name} ${contact.last_name}`.toLowerCase();
      const company = contact.company?.toLowerCase() || '';
      const query = searchQuery.toLowerCase();
      
      if (!name.includes(query) && !company.includes(query)) {
        return false;
      }
    }
    return true;
  });

  const handleManageList = () => {
    setIsManageListOpen(true)
  }

  const handleCreateList = () => {
    setIsCreateListOpen(true)
  }

  const handleCloseManageList = () => {
    setIsManageListOpen(false)
  }

  const handleCloseCreateList = () => {
    setIsCreateListOpen(false)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handleTabChange = (
    tab: "contacts" | "lists" | "autopilot" | "companies" | "my-companies" | "company-lists" | "enrich" | "view-lists" | "writer",
  ) => {
    setActiveTab(tab)
    setShowSettings(false)

    // Set appropriate table view based on tab
    if (tab === "contacts") {
      setTableView("contact")
    } else if (tab === "lists") {
      setTableView("company")
    } else if (tab === "companies" || tab === "my-companies" || tab === "company-lists") {
      // Handle companies view
    } else if (tab === "enrich") {
      // Handle enrich view
    } else {
      setTableView("social")
    }
  }

  const handleTableViewChange = (view: TableView) => {
    setTableView(view)
  }

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode)
  }

  const handleSelectContact = (id: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedContacts([...selectedContacts, id])
    } else {
      setSelectedContacts(selectedContacts.filter((contactId) => contactId !== id))
    }
  }

  const handleContactClick = (contact: ContactData) => {
    setActiveContact(contact)
    setIsDetailsPanelOpen(true)
  }

  const handleToggleFilterPanel = () => {
    setIsFilterPanelOpen(!isFilterPanelOpen)
  }

  const handleToggleEnrichmentPanel = () => {
    setIsEnrichmentPanelOpen(!isEnrichmentPanelOpen)
  }

  const handleToggleCrmPanel = () => {
    setIsCrmPanelOpen(!isCrmPanelOpen)
  }

  const handleToggleSettingsPanel = (view: "user" | "crm" | "billing" = "user") => {
    setSettingsView(view)
    setShowSettings(true)
  }

  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handleCloseDetailsPanel = () => {
    setIsDetailsPanelOpen(false)
    setActiveContact(null)
  }

  const handleAddToList = (event: React.MouseEvent, contactId?: string) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setAddToListPosition({ x: rect.left, y: rect.bottom })
    setIsAddToListOpen(true)

    if (contactId && !selectedContacts.includes(contactId)) {
      setSelectedContacts([contactId])
    }
  }

  const handleCloseAddToList = () => {
    setIsAddToListOpen(false)
  }

  const handleCreateNewList = (name: string, isDefault: boolean) => {
    const newList: List = {
      id: (lists.length + 1).toString(),
      name,
      isDefault,
      contactCount: 0,
      dateResearched: "just now",
      owner: "Kamal Digilantern",
    }

    setLists([...lists, newList])
    setIsCreateListOpen(false)
    setIsManageListOpen(false)
  }

  const handleOpenUploadCsvModal = (type: "contact" | "company" | "email") => {
    setUploadType(type)
    setIsUploadCsvModalOpen(true)
  }

  const handleCloseUploadCsvModal = () => {
    setIsUploadCsvModalOpen(false)
  }

  const handleUploadSuccess = (fileName: string) => {
    setUploadedFileName(fileName)
    setIsUploadCsvModalOpen(false)
    setIsUploadSuccessModalOpen(true)
  }

  const handleCloseUploadSuccessModal = () => {
    setIsUploadSuccessModalOpen(false)
    handleTabChange("view-lists")
  }

  return (
    <div className="flex h-screen">
      <SidebarNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onSettingsClick={handleToggleSettingsPanel}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <TopNavigation creditsAvailable={74} onIntegrationsClick={() => handleToggleSettingsPanel("crm")} />

        {showSettings ? (
          <SettingsPage view={settingsView} onViewChange={setSettingsView} onClose={() => setShowSettings(false)} />
        ) : (
          <>
            {activeTab === "writer" ? (
              <WriterPage />
            ) : (
              <>
                <ContactsHeader
                  activeTab={activeTab}
                  onTabChange={handleTabChange}
                  onManageList={handleManageList}
                  onCreateList={handleCreateList}
                  creditsAvailable={74}
                />

                <div className="flex-1 flex flex-col overflow-hidden">
                  {activeTab === "enrich" ? (
                    <EnrichView
                      onUploadContactCsv={() => handleOpenUploadCsvModal("contact")}
                      onUploadCompanyCsv={() => handleOpenUploadCsvModal("company")}
                      onUploadEmailCsv={() => handleOpenUploadCsvModal("email")}
                    />
                  ) : activeTab === "view-lists" ? (
                    <ViewMyLists lists={lists} />
                  ) : activeTab === "contacts" ? (
                    <ContactsTable
                      data={filteredContacts}
                      activeTab={activeTab}
                      tableView={tableView}
                      viewMode={viewMode}
                      searchQuery={searchQuery}
                      onSearch={handleSearch}
                      currentPage={currentPage}
                      onPageChange={setCurrentPage}
                      selectedContacts={selectedContacts}
                      onSelectContact={handleSelectContact}
                      onContactClick={handleContactClick}
                      onTableViewChange={handleTableViewChange}
                      onViewModeChange={handleViewModeChange}
                      onToggleFilterPanel={handleToggleFilterPanel}
                      onToggleEnrichmentPanel={handleToggleEnrichmentPanel}
                      onToggleCrmPanel={handleToggleCrmPanel}
                      onAddToList={handleAddToList}
                    />
                  ) : activeTab === "lists" ? (
                    <div className="flex-1 p-4 bg-gray-50">
                      <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
                        <div className="p-4 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <button className="p-2 border rounded-md">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M15 18L9 12L15 6"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                            <button className="p-2 border rounded-md">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M9 18L15 12L9 6"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                            <div className="relative">
                              <svg
                                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                                <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                              </svg>
                              <input
                                type="text"
                                placeholder="Search"
                                className="pl-9 h-9 w-60 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1 border rounded-md">
                              <button className="p-2 rounded-l-md bg-blue-600 text-white">
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                                  <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                                  <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                                  <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                                </svg>
                              </button>
                              <button className="p-2 rounded-r-md">
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M8 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                  <path d="M8 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                  <path d="M8 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                  <path d="M3 6H3.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                  <path d="M3 12H3.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                  <path d="M3 18H3.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                              </button>
                            </div>
                            <button className="p-2 border rounded-md">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <circle cx="12" cy="12" r="1" stroke="currentColor" strokeWidth="2" />
                                <circle cx="19" cy="12" r="1" stroke="currentColor" strokeWidth="2" />
                                <circle cx="5" cy="12" r="1" stroke="currentColor" strokeWidth="2" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        <div className="border-t border-gray-200">
                          <table className="w-full">
                            <thead>
                              <tr className="bg-gray-50 text-left">
                                <th className="px-4 py-3 text-sm font-medium text-gray-600 w-1/4">
                                  <div className="flex items-center">
                                    <span>Lists</span>
                                    <svg
                                      className="ml-1 h-4 w-4"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M6 9L12 15L18 9"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  </div>
                                </th>
                                <th className="px-4 py-3 text-sm font-medium text-gray-600">Record Count</th>
                                <th className="px-4 py-3 text-sm font-medium text-gray-600">Date Researched</th>
                                <th className="px-4 py-3 text-sm font-medium text-gray-600">
                                  <div className="flex items-center">
                                    <span>Owner</span>
                                    <svg
                                      className="ml-1 h-4 w-4"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M6 9L12 15L18 9"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  </div>
                                </th>
                                <th className="px-4 py-3 text-sm font-medium text-gray-600">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {lists.map((list) => (
                                <tr key={list.id} className="border-t border-gray-200 hover:bg-gray-50">
                                  <td className="px-4 py-4">
                                    <div className="flex items-center">
                                      <span className="text-blue-600 font-medium">{list.name}</span>
                                      {list.isDefault && (
                                        <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 rounded-md">Default</span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-4 py-4">{list.contactCount} contacts</td>
                                  <td className="px-4 py-4">{list.dateResearched}</td>
                                  <td className="px-4 py-4">
                                    <div className="flex items-center">
                                      <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-medium text-sm mr-2">
                                        KD
                                      </div>
                                      <span>{list.owner}</span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-4">
                                    <div className="flex items-center space-x-2">
                                      <button className="p-1 rounded-md hover:bg-gray-100">
                                        <svg
                                          width="20"
                                          height="20"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                                          <path
                                            d="M21 21L16.65 16.65"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                          />
                                        </svg>
                                      </button>
                                      <button className="p-1 rounded-md hover:bg-gray-100">
                                        <svg
                                          width="20"
                                          height="20"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <circle cx="12" cy="12" r="1" stroke="currentColor" strokeWidth="2" />
                                          <circle cx="19" cy="12" r="1" stroke="currentColor" strokeWidth="2" />
                                          <circle cx="5" cy="12" r="1" stroke="currentColor" strokeWidth="2" />
                                        </svg>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <div className="border-t border-gray-200 p-4 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <button className="flex items-center space-x-1 px-3 py-1 border rounded-md text-sm">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M19 12H5"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M12 19L5 12L12 5"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <span>Previous</span>
                            </button>
                            <div className="flex items-center">
                              <button className="w-8 h-8 flex items-center justify-center rounded-md bg-blue-600 text-white">
                                1
                              </button>
                            </div>
                            <button className="flex items-center space-x-1 px-3 py-1 border rounded-md text-sm">
                              <span>Next</span>
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M5 12H19"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M12 5L19 12L12 19"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Jump to page:</span>
                            <input
                              type="text"
                              className="w-16 h-8 rounded-md border border-gray-300 text-center"
                              value={currentPage}
                              onChange={(e) => setCurrentPage(Number(e.target.value))}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : activeTab === "my-companies" || activeTab === "company-lists" || activeTab === "companies" ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-50">
                      <div className="bg-white p-8 rounded-lg shadow-sm max-w-lg w-full text-center">
                        <div className="mb-6">
                          <img src="/placeholder.svg?height=120&width=120" alt="No companies" className="mx-auto" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">No companies added yet</h2>
                        <p className="text-gray-600 mb-6">Find companies to add</p>
                        <button
                          className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium"
                          onClick={() => handleOpenUploadCsvModal("company")}
                        >
                          Upload Companies
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 p-4 bg-gray-50">
                      <div className="bg-white rounded-md border border-gray-200 p-8 text-center">
                        <h2 className="text-xl font-semibold mb-2">Autopilot</h2>
                        <p className="text-gray-600">This feature is coming soon.</p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Modals and panels */}
      {isManageListOpen && (
        <ManageListModal onClose={handleCloseManageList} onCreateList={handleCreateNewList} lists={lists} />
      )}

      {isCreateListOpen && <CreateListModal onClose={handleCloseCreateList} onCreateList={handleCreateNewList} />}

      {isAddToListOpen && (
        <AddToListDropdown
          position={addToListPosition}
          onClose={handleCloseAddToList}
          lists={lists}
          onCreateNewList={handleCreateList}
        />
      )}

      {isFilterPanelOpen && (
        <FilterPanel
          filters={filters}
          onApplyFilters={handleApplyFilters}
          onClose={() => setIsFilterPanelOpen(false)}
        />
      )}

      {isEnrichmentPanelOpen && (
        <DataEnrichmentPanel
          selectedContacts={selectedContacts.map((id) => contactsData.find((contact) => contact.id === id)!)}
          onClose={() => setIsEnrichmentPanelOpen(false)}
        />
      )}

      {isCrmPanelOpen && <CrmIntegrationPanel onClose={() => setIsCrmPanelOpen(false)} />}

      {isDetailsPanelOpen && activeContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl h-[90vh] overflow-hidden">
            <ContactDetailsPanel contact={activeContact} onClose={handleCloseDetailsPanel} />
          </div>
        </div>
      )}

      {isUploadCsvModalOpen && (
        <UploadCsvModal type={uploadType} onClose={handleCloseUploadCsvModal} onUploadSuccess={handleUploadSuccess} />
      )}

      {isUploadSuccessModalOpen && (
        <UploadSuccessModal fileName={uploadedFileName} onClose={handleCloseUploadSuccessModal} />
      )}
    </div>
  )
}

