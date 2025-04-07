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
  phone: { label: "Phone", enabled: true },
  email: { label: "Email", enabled: true },
  location: { label: "Location", enabled: true },
  source: { label: "Source", enabled: true },
  dateAdded: { label: "Date Added", enabled: false },
  lastInteraction: { label: "Last Interaction", enabled: false },
  linkedin: { label: "LinkedIn", enabled: true },
  twitter: { label: "Twitter", enabled: false },
  facebook: { label: "Facebook", enabled: false },
  tags: { label: "Tags", enabled: true },
  status: { label: "Status", enabled: false },
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
  isVerifyingEmail,
  verifyingEmailId,
  isEmailFinding,
  findingEmailId,
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
      try {
        setVisibleColumns(JSON.parse(savedColumns));
      } catch (e) {
        console.error("Failed to parse saved columns", e);
      }
    }
  }, []);

  // Save user preferences to localStorage
  useEffect(() => {
    localStorage.setItem("contactsViewMode", viewMode);
    localStorage.setItem("contactsVisibleColumns", JSON.stringify(visibleColumns));
  }, [viewMode, visibleColumns]);

  // Pagination logic
  const totalPages = Math.ceil(filteredContacts.length / pageSize);
  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Reset to first page when contacts change
  useEffect(() => {
    setCurrentPage(1);
  }, [contacts]);

  // Contact card component for grid view
  const ContactCard = ({ contact }: { contact: Contact }) => {
    return (
      <Card className="overflow-hidden">
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 border border-gray-200">
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
                <h3 className="font-semibold text-gray-900 line-clamp-1">
                  {contact.fullName}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-1">
                  {contact.jobTitle}
                  {contact.jobTitle && contact.companyName && " at "}
                  {contact.companyName}
                </p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onViewDetails(contact)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEditContact(contact)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Contact
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAIWriter(contact)}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Write with AI
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCRMExport(contact)}>
                  <Upload className="mr-2 h-4 w-4" />
                  Export to CRM
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDeleteContact(contact)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Contact
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-3 space-y-2 text-sm">
            {contact.email ? (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <a
                  href={`mailto:${contact.email}`}
                  className="text-blue-600 hover:underline truncate"
                >
                  {contact.email}
                </a>
                {contact.emailVerified && (
                  <Badge
                    variant="outline"
                    className="ml-1 text-xs bg-green-50 text-green-700 border-green-200"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" /> Verified
                  </Badge>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => onEmailReveal(contact.id)}
                  disabled={isRevealingEmail}
                >
                  {isRevealingEmail ? (
                    <>
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                      Revealing...
                    </>
                  ) : (
                    "Reveal Email"
                  )}
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
                  }}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="w-[130px]">
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
        </div>
      </div>

      {filteredContacts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="rounded-full bg-gray-100 p-3 mb-4">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No contacts found
            </h3>
            <p className="text-gray-500 text-center max-w-sm">
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
        <div className="w-full rounded-lg border border-gray-200">
          {/* This is the key change: adding a fixed height container with overflow */}
          <div className="max-h-[calc(100vh-300px)] overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-gray-50 z-10">
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
                  <TableHead className="text-right sticky right-0 bg-gray-50">Actions</TableHead>
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
                            <span className="text-gray-500">—</span>
                          )}
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.phone.enabled && (
                      <TableCell className="py-3">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {contact.phone ? (
                            <span className="text-gray-600">{contact.phone}</span>
                          ) : (
                            <span className="text-gray-500">—</span>
                          )}
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.email.enabled && (
                      <TableCell className="py-3">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          {contact.email ? (
                            <div className="flex items-center gap-2">
                              <a
                                href={`mailto:${contact.email}`}
                                className="text-blue-600 hover:underline truncate max-w-[150px]"
                              >
                                {contact.email}
                              </a>
                              {contact.emailVerified && (
                                <Badge
                                  variant="outline"
                                  className="ml-1 text-xs bg-green-50 text-green-700 border-green-200"
                                >
                                  <CheckCircle className="w-3 h-3 mr-1" />{" "}
                                  Verified
                                </Badge>
                              )}
                              {onVerifyEmail && !contact.emailVerified && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="ml-1 h-6 px-2 text-xs"
                                  onClick={() => 
                                    onVerifyEmail && onVerifyEmail(contact)
                                  }
                                  disabled={
                                    isVerifyingEmail &&
                                    verifyingEmailId === contact.id
                                  }
                                >
                                  {isVerifyingEmail &&
                                  verifyingEmailId === contact.id ? (
                                    <>
                                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                      Verifying
                                    </>
                                  ) : (
                                    "Verify"
                                  )}
                                </Button>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 px-2 text-xs"
                                onClick={() => onEmailReveal(contact.id)}
                                disabled={isRevealingEmail}
                              >
                                {isRevealingEmail ? (
                                  <>
                                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                    Revealing...
                                  </>
                                ) : (
                                  "Reveal Email"
                                )}
                              </Button>
                              {onEmailFind && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-7 px-2 text-xs"
                                  onClick={() => onEmailFind(contact)}
                                  disabled={
                                    isEmailFinding &&
                                    findingEmailId === contact.id
                                  }
                                >
                                  {isEmailFinding &&
                                  findingEmailId === contact.id ? (
                                    <>
                                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                      Finding...
                                    </>
                                  ) : (
                                    "Find Email"
                                  )}
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.location.enabled && (
                      <TableCell className="py-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            {contact.location || "—"}
                          </span>
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.source.enabled && (
                      <TableCell className="py-3">
                        {contact.source ? (
                          <Badge
                            variant="outline"
                            className="text-xs bg-purple-50 text-purple-700 border-purple-200"
                          >
                            {contact.source}
                          </Badge>
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </TableCell>
                    )}
                    {visibleColumns.dateAdded.enabled && (
                      <TableCell className="py-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            {contact.createdAt
                              ? new Date(contact.createdAt).toLocaleDateString()
                              : "—"}
                          </span>
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.lastInteraction.enabled && (
                      <TableCell className="py-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            {contact.lastInteractionDate
                              ? new Date(
                                  contact.lastInteractionDate,
                                ).toLocaleDateString()
                              : "—"}
                          </span>
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.linkedin.enabled && (
                      <TableCell className="py-3">
                        <div className="flex items-center gap-2">
                          <Linkedin className="w-4 h-4 text-gray-400" />
                          {contact.linkedInUrl ? (
                            <a
                              href={contact.linkedInUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Profile
                            </a>
                          ) : (
                            <span className="text-gray-500">—</span>
                          )}
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.twitter.enabled && (
                      <TableCell className="py-3">
                        <div className="flex items-center gap-2">
                          <Twitter className="w-4 h-4 text-gray-400" />
                          {contact.twitterUrl ? (
                            <a
                              href={contact.twitterUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Profile
                            </a>
                          ) : (
                            <span className="text-gray-500">—</span>
                          )}
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.facebook.enabled && (
                      <TableCell className="py-3">
                        <div className="flex items-center gap-2">
                          <Facebook className="w-4 h-4 text-gray-400" />
                          {contact.facebookUrl ? (
                            <a
                              href={contact.facebookUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Profile
                            </a>
                          ) : (
                            <span className="text-gray-500">—</span>
                          )}
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.tags.enabled && (
                      <TableCell className="py-3">
                        <div className="flex flex-wrap gap-1">
                          {contact.tags?.length ? (
                            contact.tags.map((tag, i) => (
                              <Badge
                                key={i}
                                variant="secondary"
                                className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200"
                              >
                                {tag}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-gray-500">—</span>
                          )}
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.status.enabled && (
                      <TableCell className="py-3">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            contact.status === "lead"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : contact.status === "prospect"
                              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                              : contact.status === "customer"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-gray-50 text-gray-700 border-gray-200",
                          )}
                        >
                          {contact.status
                            ? contact.status.charAt(0).toUpperCase() +
                              contact.status.slice(1)
                            : "Unknown"}
                        </Badge>
                      </TableCell>
                    )}
                    <TableCell className="py-3 text-right sticky right-0 bg-white">
                      <div className="flex items-center justify-end space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onViewDetails(contact)}
                        >
                          <Eye className="h-4 w-4 text-gray-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onEditContact(contact)}
                        >
                          <Pencil className="h-4 w-4 text-gray-500" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4 text-gray-500" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleAIWriter(contact)}
                            >
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Write with AI
                            </DropdownMenuItem>
                            {onSendEmail && (
                              <DropdownMenuItem
                                onClick={() => onSendEmail(contact)}
                              >
                                <Mail className="mr-2 h-4 w-4" />
                                Send Email
                              </DropdownMenuItem>
                            )}
                            {onEnrichContact && (
                              <DropdownMenuItem
                                onClick={() => onEnrichContact(contact)}
                              >
                                <Sparkles className="mr-2 h-4 w-4" />
                                Enrich Data
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleCRMExport(contact)}
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              Export to CRM
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => onDeleteContact(contact)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Contact
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex-1 text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">
              {(currentPage - 1) * pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(currentPage * pageSize, filteredContacts.length)}
            </span>{" "}
            of <span className="font-medium">{filteredContacts.length}</span>{" "}
            results
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((page) => Math.min(page + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 flex justify-end">
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => {
                const newSize = parseInt(value);
                if (onPageSizeChange) {
                  onPageSizeChange(newSize);
                }
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[100px] h-8">
                <SelectValue placeholder="10 per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 per page</SelectItem>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="20">20 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
                <SelectItem value="100">100 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}