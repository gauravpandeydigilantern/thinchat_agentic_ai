export interface ContactData {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
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

export interface StatisticsResponse {
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

export type ViewMode = "grid" | "list"
export type TableView = "contact" | "company" | "social"

