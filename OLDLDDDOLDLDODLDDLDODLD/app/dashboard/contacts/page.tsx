"use client"

import { useState, useEffect } from "react"
import { ContactsTable } from "@/components/contacts-table"
import { leadsService } from "@/services/lead-service"
import type { ContactData, ViewMode, TableView } from "@/lib/types"

export default function ContactsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [tableView, setTableView] = useState<TableView>("contact")
  const [viewMode, setViewMode] = useState<ViewMode>("list")

  const [statistics, setContactData] = useState<{
    data: ContactData[],
    count: number,
  }>({
    data: [],
    count: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      const statistics = await leadsService.fetchDataThroughBaseUrl(
        process.env.NEXT_PUBLIC_API_BASE_URL || "",
        "/account?type=mycontact"
      )
      setContactData(statistics)
    }
    fetchData()
  }, [])

  const filteredContacts = statistics.data.filter((contact) => {
    if (searchQuery) {
      const name = `${contact.firstName} ${contact.lastName}`.toLowerCase()
      const company = contact.company?.toLowerCase() || ""
      const query = searchQuery.toLowerCase()
      
      if (!name.includes(query) && !company.includes(query)) {
        return false
      }
    }
    return true
  })

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handleSelectContact = (id: string, isSelected: boolean) => {
    setSelectedContacts(isSelected 
      ? [...selectedContacts, id]
      : selectedContacts.filter(contactId => contactId !== id)
    )
  }

  return (
    <ContactsTable
      data={filteredContacts}
      activeTab="contacts"
      tableView={tableView}
      viewMode={viewMode}
      searchQuery={searchQuery}
      onSearch={handleSearch}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      selectedContacts={selectedContacts}
      onSelectContact={handleSelectContact}
      onTableViewChange={setTableView}
      onViewModeChange={setViewMode}
      onToggleFilterPanel={() => {}}
      onToggleEnrichmentPanel={() => {}}
      onToggleCrmPanel={() => {}}
      onAddToList={() => {}}
      onContactClick={() => {}}
    />
  )
}
