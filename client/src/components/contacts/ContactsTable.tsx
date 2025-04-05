"use client";

import { useState, useEffect } from "react";
import type { Contact, Company } from "@shared/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Mail,
  MoreHorizontal,
  FileText,
  Trash2,
  Pencil,
  Sparkles,
  Phone,
  MapPin,
  Globe,
  Building,
  Calendar,
  Users,
  Linkedin,
  Twitter,
  Facebook,
  MessageSquare,
  Building2,
  List,
  Upload,
  Loader2,
  Search,
  Grid,
  TableIcon,
  Brain,
  Download,
  Eye,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Filter,
  FilterX,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ContactFilters from "./ContactFilters";

interface ContactsTableProps {
  contacts: Contact[];
  companies: Company[];
  onEmailReveal: (contactId: number) => void;
  onEditContact: (contact: Contact) => void;
  onDeleteContact: (contact: Contact) => void;
  onViewDetails: (contact: Contact) => void;
  onEnrichContact?: (contact: Contact) => void;
  onSendEmail?: (contact: Contact) => void;
  isRevealingEmail: boolean;
  isVerifyingEmail?: boolean;
  verifyingEmailId?: number | null;
  isEmailFinding?: boolean;
  findingEmailId?: number | null;
  onEmailFind?: (contact: Contact) => void;
  handleAIWriter: (contact: Contact) => void;
  onVerifyEmail?: (contact: Contact) => void;
  handleCRMExport: (contact: Contact) => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
}

// Define available columns
const COLUMNS = {
  contact: { label: "Contact", enabled: true },
  title: { label: "Title", enabled: true },
  company: { label: "Company", enabled: true },
  website: { label: "Website", enabled: true },
  companyEmails: { label: "Company Emails", enabled: true },
  contactEmails: { label: "Contact Emails", enabled: true },
  emailVerified: { label: "Email Verified", enabled: true },
  companyPhones: { label: "Company Phones", enabled: true },
  contactPhones: { label: "Contact Phones", enabled: true },
  contactSocials: { label: "Contact Socials", enabled: true },
  industry: { label: "Industry", enabled: true },
  contactLocation: { label: "Contact Location", enabled: true },
  seniority: { label: "Seniority", enabled: true },
  department: { label: "Department", enabled: true },
  companyLocation: { label: "Company Location", enabled: true },
  employeeSize: { label: "Employee Size", enabled: true },
  companySocials: { label: "Company Socials", enabled: true },
  aiWriter: { label: "AI Writer", enabled: true },
  dateResearched: { label: "Date Researched", enabled: true },
  lists: { label: "Lists", enabled: true },
  crm: { label: "CRM", enabled: true },
};

export default function ContactsTable({
  contacts,
  companies,
  onEmailReveal,
  onEditContact,
  onDeleteContact,
  onViewDetails,
  onEnrichContact,
  onSendEmail,
  isRevealingEmail,
  isVerifyingEmail = false,
  verifyingEmailId = null,
  isEmailFinding = false,
  findingEmailId = null,
  onEmailFind,
  onVerifyEmail,
  handleAIWriter,
  handleCRMExport,
  pageSize = 10,
  onPageSizeChange,
}: ContactsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredContacts, setFilteredContacts] = useState(contacts);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  // View state (table/grid)
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState(COLUMNS);

  // AI Insights state
  const [showAIInsights, setShowAIInsights] = useState(false);

  // Filter contacts based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredContacts(contacts);
      return;
    }

    const lowercasedSearch = searchTerm.toLowerCase();
    const filtered = contacts.filter(
      (contact) =>
        contact.fullName?.toLowerCase().includes(lowercasedSearch) ||
        contact.email?.toLowerCase().includes(lowercasedSearch) ||
        contact.companyName?.toLowerCase().includes(lowercasedSearch) ||
        contact.jobTitle?.toLowerCase().includes(lowercasedSearch) ||
        contact.industry?.toLowerCase().includes(lowercasedSearch),
    );

    setFilteredContacts(filtered);
    setCurrentPage(1);
  }, [searchTerm, contacts]);

  // Load user preferences from localStorage
  useEffect(() => {
    const savedView = localStorage.getItem("contactsViewMode");
    if (savedView === "table" || savedView === "grid") {
      setViewMode(savedView);
    }

    const savedColumns = localStorage.getItem("contactsVisibleColumns");
    if (savedColumns) {
      setVisibleColumns(JSON.parse(savedColumns));
    }
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem("contactsViewMode", viewMode);
    localStorage.setItem(
      "contactsVisibleColumns",
      JSON.stringify(visibleColumns),
    );
  }, [viewMode, visibleColumns]);

  // Get status message helper
  const getStatusMessage = (status: string) => {
    const statusMessages: Record<string, string> = {
      NONE: "Queued for processing",
      SCHEDULED: "Scheduled for next batch",
      IN_PROGRESS: "Search in progress...",
      BAD_INPUT: "Invalid input data",
      INSUFFICIENT_FUNDS: "Insufficient credits",
      ABORTED: "Search cancelled",
      NOT_FOUND: "No email found",
      DEBITED_NOT_FOUND: "No email found (credited used)",
      FOUND: "Email found",
      DEBITED: "Email found and verified",
    };
    return statusMessages[status] || status;
  };

  // Get status color helper
  const getStatusColor = (status: string) => {
    switch (status) {
      case "FOUND":
      case "DEBITED":
        return "bg-green-100 text-green-700";
      case "NOT_FOUND":
      case "DEBITED_NOT_FOUND":
      case "BAD_INPUT":
      case "INSUFFICIENT_FUNDS":
      case "ABORTED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredContacts.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedContacts = filteredContacts.slice(
    startIndex,
    startIndex + pageSize,
  );

  // Export to CSV function
  const exportToCSV = () => {
    const headers = Object.entries(visibleColumns)
      .filter(([_, col]) => col.enabled)
      .map(([_, col]) => col.label);

    const csv = [
      headers.join(","),
      ...filteredContacts.map((contact) => {
        const row = Object.entries(visibleColumns)
          .filter(([_, col]) => col.enabled)
          .map(([key]) => {
            return contact[key as keyof Contact] || "";
          });
        return row.join(",");
      }),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contacts.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // AI Insights Component
  const AIInsights = () => {
    if (!showAIInsights) return null;

    // Calculate some basic insights
    const totalContacts = contacts.length;
    const verifiedEmails = contacts.filter((c) => c.emailVerified).length;
    const recentContacts = contacts.filter((c) => {
      const created = new Date(c.createdAt);
      return (
        (new Date().getTime() - created.getTime()) / (1000 * 3600 * 24) <= 7
      );
    }).length;

    // Calculate industry distribution
    const industries = contacts.reduce(
      (acc, contact) => {
        if (contact.industry) {
          acc[contact.industry] = (acc[contact.industry] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    // Sort industries by count
    const topIndustries = Object.entries(industries)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return (
      <Card className="mb-6 border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-500" />
              <h3 className="font-semibold text-lg">AI Insights</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAIInsights(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-purple-50 to-white border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Contacts</p>
                    <p className="text-3xl font-bold text-purple-700">
                      {totalContacts}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-purple-400 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-white border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      Verified Emails
                    </p>
                    <p className="text-3xl font-bold text-green-700">
                      {verifiedEmails}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {totalContacts > 0
                        ? Math.round((verifiedEmails / totalContacts) * 100)
                        : 0}
                      % of total
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-400 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-white border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      Added Last 7 Days
                    </p>
                    <p className="text-3xl font-bold text-blue-700">
                      {recentContacts}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-400 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          {topIndustries.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-500 mb-3">
                Top Industries
              </h4>
              <div className="space-y-2">
                {topIndustries.map(([industry, count]) => (
                  <div key={industry} className="flex items-center">
                    <div className="w-32 truncate text-sm">{industry}</div>
                    <div className="flex-1 mx-2">
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500 rounded-full"
                          style={{ width: `${(count / totalContacts) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 w-12 text-right">
                      {Math.round((count / totalContacts) * 100)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // Contact Card Component for Grid View
  const ContactCard = ({ contact }: { contact: Contact }) => {
    return (
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-md border border-gray-200">
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12 border border-gray-200">
                <AvatarImage
                  src={contact.profileImageUrl || ""}
                  alt={contact.fullName}
                />
                <AvatarFallback className="bg-purple-100 text-purple-700">
                  {contact.fullName
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "?"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-gray-900">
                  {contact.fullName}
                </div>
                <div className="text-sm text-gray-500">{contact.jobTitle}</div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => onViewDetails(contact)}>
                  <FileText className="w-4 h-4 mr-2 text-gray-500" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEditContact(contact)}>
                  <Pencil className="w-4 h-4 mr-2 text-gray-500" />
                  Edit
                </DropdownMenuItem>
                {onEnrichContact && (
                  <DropdownMenuItem onClick={() => onEnrichContact(contact)}>
                    <Sparkles className="w-4 h-4 mr-2 text-amber-500" />
                    Enrich Data
                  </DropdownMenuItem>
                )}
                {onSendEmail && contact.email && (
                  <DropdownMenuItem onClick={() => onSendEmail(contact)}>
                    <Mail className="w-4 h-4 mr-2 text-blue-500" />
                    Send Email
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => handleAIWriter(contact)}>
                  <MessageSquare className="w-4 h-4 mr-2 text-purple-500" />
                  AI Writer
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleCRMExport(contact)}>
                  <Upload className="w-4 h-4 mr-2 text-green-500" />
                  Export to CRM
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDeleteContact(contact)}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-4 space-y-2 text-sm">
            {contact.companyName && (
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="truncate">{contact.companyName}</span>
              </div>
            )}
            {contact.email ? (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="truncate">{contact.email}</span>
                {contact.emailVerified && (
                  <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEmailFind?.(contact)}
                  disabled={!contact.fullName || isEmailFinding}
                  className="text-purple-600 hover:text-purple-700 p-0 h-auto font-normal text-xs"
                >
                  Find Email
                </Button>
              </div>
            )}
            {contact.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="truncate">{contact.phone}</span>
              </div>
            )}
            {contact.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="truncate">{contact.location}</span>
              </div>
            )}
          </div>

          {contact.tags && contact.tags.length > 0 && (
            <div className="mt-4 flex gap-1 flex-wrap">
              {contact.tags.map((tag, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <div className="flex border-t border-gray-100 divide-x divide-gray-100">
          <Button
            variant="ghost"
            className="flex-1 rounded-none h-10 text-xs font-normal text-gray-600"
            onClick={() => onViewDetails(contact)}
          >
            <Eye className="w-3 h-3 mr-1" />
            View
          </Button>
          <Button
            variant="ghost"
            className="flex-1 rounded-none h-10 text-xs font-normal text-gray-600"
            onClick={() => onEditContact(contact)}
          >
            <Pencil className="w-3 h-3 mr-1" />
            Edit
          </Button>
          <Button
            variant="ghost"
            className="flex-1 rounded-none h-10 text-xs font-normal text-gray-600"
            onClick={() => handleAIWriter(contact)}
          >
            <MessageSquare className="w-3 h-3 mr-1" />
            AI Writer
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <div className="w-full space-y-4">
      {isFiltersVisible && (
        <div className="w-full md:w-64 flex-shrink-0">
          <ContactFilters />
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center justify-between border-b p-3">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFiltersVisible(!isFiltersVisible)}
              className="h-8"
            >
              {isFiltersVisible ? (
                <FilterX className="h-4 w-4 mr-1" />
              ) : (
                <Filter className="h-4 w-4 mr-1" />
              )}
              {isFiltersVisible ? "Hide Filters" : "Filters"}
            </Button>

            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-400" />
                <Input
                  placeholder="Search contacts..."
                  className="pl-9 w-full sm:w-[250px]"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    const term = e.target.value.toLowerCase();
                    const filtered = contacts.filter(contact =>
                      contact.fullName?.toLowerCase().includes(term) ||
                      contact.email?.toLowerCase().includes(term) ||
                      contact.jobTitle?.toLowerCase().includes(term) ||
                      contact.companyName?.toLowerCase().includes(term) ||
                      contact.location?.toLowerCase().includes(term)
                    );
                    setFilteredContacts(filtered);
                    setCurrentPage(1);
                  }}
                />
                {searchTerm && (
                  <button 
                    onClick={() => {
                      setSearchTerm("");
                      setFilteredContacts(contacts);
                    }}
                    className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-neutral-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value="all"
                  onValueChange={(value) => {
                    const filtered = contacts.filter(contact => {
                      if (value === "all") return true;
                      if (value === "withEmail") return !!contact.email;
                      if (value === "noEmail") return !contact.email;
                      if (value === "verified") return contact.emailVerified;
                      return true;
                    });
                    setFilteredContacts(filtered);
                  }}
                >
                  <SelectTrigger className="h-9 w-[130px]">
                    <SelectValue placeholder="Filter by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Contacts</SelectItem>
                    <SelectItem value="withEmail">With Email</SelectItem>
                    <SelectItem value="noEmail">No Email</SelectItem>
                    <SelectItem value="verified">Verified Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAIInsights(!showAIInsights)}
                  className="border-gray-200 text-gray-700 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200"
                >
                  <Brain className="w-4 h-4 mr-2 text-purple-500" />
                  Insights
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View AI-powered insights about your contacts</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Tabs
            defaultValue={viewMode}
            onValueChange={(value) => setViewMode(value as "table" | "grid")}
            className="w-auto"
          >
            <TabsList className="h-9 bg-gray-100 p-0.5">
              <TabsTrigger
                value="table"
                className="h-8 px-3 data-[state=active]:bg-white"
              >
                <TableIcon className="w-4 h-4 mr-2" />
                Table
              </TabsTrigger>
              <TabsTrigger
                value="grid"
                className="h-8 px-3 data-[state=active]:bg-white"
              >
                <Grid className="w-4 h-4 mr-2" />
                Grid
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-200 text-gray-700"
              >
                <Eye className="w-4 h-4 mr-2" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="p-2">
                <p className="text-sm font-medium mb-2">Visible Columns</p>
                <div className="max-h-[300px] overflow-y-auto">
                  {Object.entries(visibleColumns).map(([key, col]) => (
                    <DropdownMenuCheckboxItem
                      key={key}
                      checked={col.enabled}
                      onCheckedChange={(checked) => {
                        setVisibleColumns((prev) => ({
                          ...prev,
                          [key]: { ...prev[key], enabled: checked },
                        }));
                      }}
                      className="py-1.5"
                    >
                      {col.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="sm"
            onClick={exportToCSV}
            className="border-gray-200 text-gray-700 hover:bg-green-50 hover:text-green-700 hover:border-green-200"
          >
            <Download className="w-4 h-4 mr-2 text-green-600" />
            Export
          </Button>
        </div>
      </div>

      {showAIInsights && <AIInsights />}

      {filteredContacts.length === 0 ? (
        <Card className="border-dashed border-2 border-gray-200">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-gray-100 p-3 mb-4">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No contacts found
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              {searchTerm
                ? `No contacts match your search for "${searchTerm}". Try a different search term.`
                : "You don't have any contacts yet. Add some contacts to get started."}
            </p>
          </CardContent>
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginatedContacts.map((contact) => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </div>
      ) : (
        <div className="w-full overflow-auto rounded-lg border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="w-[30px]">
                  <input type="checkbox" className="rounded border-gray-300" />
                </TableHead>
                {Object.entries(visibleColumns).map(
                  ([key, col]) =>
                    col.enabled && (
                      <TableHead
                        key={key}
                        className="font-medium text-gray-700"
                      >
                        {col.label}
                      </TableHead>
                    ),
                )}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedContacts.map((contact) => (
                <TableRow
                  key={contact.id}
                  className="hover:bg-gray-50 border-b border-gray-100"
                >
                  <TableCell className="py-3">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                    />
                  </TableCell>
                  {visibleColumns.contact.enabled && (
                    <TableCell className="py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8 border border-gray-200">
                          <AvatarImage
                            src={contact.profileImageUrl || ""}
                            alt={contact.fullName}
                          />
                          <AvatarFallback className="bg-purple-100 text-purple-700 text-xs">
                            {contact.fullName
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("") || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="font-medium text-gray-900">
                          {contact.fullName}
                        </div>
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.title.enabled && (
                    <TableCell className="py-3 text-gray-600">
                      {contact.jobTitle || "—"}
                    </TableCell>
                  )}
                  {visibleColumns.company.enabled && (
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          {companies.find((c) => c.id === contact.companyId)
                            ?.name ||
                            contact.companyName ||
                            "—"}
                        </span>
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.website.enabled && (
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-400" />
                        {contact.website ? (
                          <a
                            href={contact.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline truncate max-w-[200px]"
                          >
                            {contact.website.replace(
                              /^https?:\/\/(www\.)?/,
                              "",
                            )}
                          </a>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.companyEmails.enabled && (
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 truncate max-w-[200px]">
                          {contact.companyEmail || "—"}
                        </span>
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.contactEmails.enabled && (
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {contact.email ||
                        (isEmailFinding && findingEmailId === contact.id) ? (                          <div className="flex items-center gap-2">
                            {isEmailFinding && findingEmailId === contact.id ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
                                <span className="text-gray-600">
                                  {contact.emailStatus
                                    ? getStatusMessage(contact.emailStatus)
                                    : "Finding..."}
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="text-gray-600 truncate max-w-[150px]">
                                  {contact.email}
                                </span>
                                {contact.emailStatus && (
                                  <span
                                    className={`text-xs px-1.5 py-0.5 rounded ${getStatusColor(contact.emailStatus)}`}
                                  >
                                    {getStatusMessage(contact.emailStatus)}
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEmailFind?.(contact)}
                            disabled={!contact.fullName || isEmailFinding}
                            className="text-purple-600 hover:text-purple-700 p-0 h-auto font-normal text-xs"
                          >
                            <Search className="mr-1 h-3 w-3" />
                            Find Email
                            <span className="ml-1 text-xs bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded">
                              1 credit
                            </span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.emailVerified.enabled && (
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        {contact.emailVerified ? (
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        ) : contact.email ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onVerifyEmail?.(contact)}
                            disabled={
                              !contact.email ||
                              !onVerifyEmail ||
                              (isVerifyingEmail &&
                                verifyingEmailId !== null &&
                                verifyingEmailId === contact.id)
                            }
                            className="h-7 text-xs"
                          >
                            {isVerifyingEmail &&
                            verifyingEmailId !== null &&
                            verifyingEmailId === contact.id ? (
                              <>
                                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                Verifying...
                              </>
                            ) : (
                              "Verify Email"
                            )}
                          </Button>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.companyPhones.enabled && (
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 truncate max-w-[150px]">
                          {contact.companyPhone || "—"}
                        </span>
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.contactPhones.enabled && (
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 truncate max-w-[150px]">
                          {contact.phone || "—"}
                        </span>
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.contactSocials.enabled && (
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        {contact.linkedInUrl ? (
                          <a
                            href={contact.linkedInUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600"
                          >
                            <Linkedin className="w-4 h-4" />
                          </a>
                        ) : null}
                        {contact.twitterUrl ? (
                          <a
                            href={contact.twitterUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400"
                          >
                            <Twitter className="w-4 h-4" />
                          </a>
                        ) : null}
                        {!contact.linkedInUrl && !contact.twitterUrl && (
                          <span className="text-gray-400">—</span>
                        )}
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.industry.enabled && (
                    <TableCell className="py-3 text-gray-600">
                      {contact.industry || "—"}
                    </TableCell>
                  )}
                  {visibleColumns.contactLocation.enabled && (
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 truncate max-w-[150px]">
                          {contact.location || "—"}
                        </span>
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.seniority.enabled && (
                    <TableCell className="py-3 text-gray-600">
                      {contact.seniority || "—"}
                    </TableCell>
                  )}
                  {visibleColumns.department.enabled && (
                    <TableCell className="py-3 text-gray-600">
                      {contact.department || "—"}
                    </TableCell>
                  )}
                  {visibleColumns.companyLocation.enabled && (
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 truncate max-w-[150px]">
                          {contact.companyLocation || "—"}
                        </span>
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.employeeSize.enabled && (
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          {contact.employeeSize || "—"}
                        </span>
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.companySocials.enabled && (
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        {contact.companySocials?.linkedin ? (
                          <a
                            href={contact.companySocials.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600"
                          >
                            <Linkedin className="w-4 h-4" />
                          </a>
                        ) : null}
                        {contact.companySocials?.twitter ? (
                          <a
                            href={contact.companySocials.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400"
                          >
                            <Twitter className="w-4 h-4" />
                          </a>
                        ) : null}
                        {contact.companySocials?.facebook ? (
                          <a
                            href={contact.companySocials.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600"
                          >
                            <Facebook className="w-4 h-4" />
                          </a>
                        ) : null}
                        {!contact.companySocials?.linkedin &&
                          !contact.companySocials?.twitter &&
                          !contact.companySocials?.facebook && (
                            <span className="text-gray-400">—</span>
                          )}
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.aiWriter.enabled && (
                    <TableCell className="py-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAIWriter(contact)}
                        className="h-8 w-8 p-0 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  )}
                  {visibleColumns.dateResearched.enabled && (
                    <TableCell className="py-3">
                      {contact.dateResearched ? (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            {new Date(
                              contact.dateResearched,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </TableCell>
                  )}
                  {visibleColumns.lists.enabled && (
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        <List className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 truncate max-w-[150px]">
                          {contact.lists?.join(", ") || "—"}
                        </span>
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.crm.enabled && (
                    <TableCell className="py-3">
                      {contact.crmSource ? (
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200"
                        >
                          {contact.crmSource}
                        </Badge>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </TableCell>
                  )}
                  <TableCell className="py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuItem
                          onClick={() => onViewDetails(contact)}
                        >
                          <FileText className="w-4 h-4 mr-2 text-gray-500" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onEditContact(contact)}
                        >
                          <Pencil className="w-4 h-4 mr-2 text-gray-500" />
                          Edit
                        </DropdownMenuItem>
                        {onEnrichContact && (
                          <DropdownMenuItem
                            onClick={() => onEnrichContact(contact)}
                          >
                            <Sparkles className="w-4 h-4 mr-2 text-amber-500" />
                            Enrich Data
                          </DropdownMenuItem>
                        )}
                        {onSendEmail && contact.email && (
                          <DropdownMenuItem
                            onClick={() => onSendEmail(contact)}
                          >
                            <Mail className="w-4 h-4 mr-2 text-blue-500" />
                            Send Email
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => handleAIWriter(contact)}
                        >
                          <MessageSquare className="w-4 h-4 mr-2 text-purple-500" />
                          AI Writer
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleCRMExport(contact)}
                        >
                          <Upload className="w-4 h-4 mr-2 text-green-500" />
                          Export to CRM
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDeleteContact(contact)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination Controls */}
      {filteredContacts.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Show:</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => onPageSizeChange?.(Number(value))}
            >
              <SelectTrigger className="h-9 w-[70px] border-gray-200">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-500">
              Showing {startIndex + 1} -{" "}
              {Math.min(startIndex + pageSize, filteredContacts.length)} of{" "}
              {filteredContacts.length}
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0 border-gray-200"
            >
              <ChevronLeft className="h-4 w-4" />
              <ChevronLeft className="h-4 w-4 -ml-2" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0 border-gray-200"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Logic to show pages around current page
              let pageNum = i + 1;
              if (totalPages > 5) {
                if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
              }

              return (
                <Button
                  key={i}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className={cn(
                    "h-8 w-8 p-0 border-gray-200",
                    currentPage === pageNum &&
                      "bg-purple-600 hover:bg-purple-700",
                  )}
                >
                  {pageNum}
                </Button>
              );
            })}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0 border-gray-200"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0 border-gray-200"
            >
              <ChevronRight className="h-4 w-4" />
              <ChevronRight className="h-4 w-4 -ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}