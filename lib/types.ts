export interface ContactData {
  id: string
  name: string
  title: string
  company: string
  website: string
  companyEmail: string
  contactEmail?: string
  companyPhone?: string
  industry: string
  location: string
  companyLocation: string
  employeeSize: string
  seniority: string
  department: string
  dateResearched: string
}

export interface List {
  id: string
  name: string
  isDefault: boolean
  contactCount: number
  dateResearched: string
  owner: string
}

export type ViewMode = "grid" | "list"
export type TableView = "contact" | "company" | "social"

