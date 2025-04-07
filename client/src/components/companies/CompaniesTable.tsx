import React, { useRef, useState } from "react";
import { Company } from "@shared/schema";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MoreHorizontal, 
  Trash2, 
  Edit, 
  Globe, 
  Building2, 
  FileText, 
  MapPin, 
  Users,
  ExternalLink
} from "lucide-react";

interface CompaniesTableProps {
  companies: Company[];
  onViewCompany: (company: Company) => void;
  onViewContacts: (company: Company) => void;
  onEditCompany: (company: Company) => void;
  onDeleteCompany: (company: Company) => void;
}

export function CompaniesTable({ 
  companies,
  onViewCompany,
  onViewContacts,
  onEditCompany,
  onDeleteCompany
}: CompaniesTableProps) {
  const tableBodyRef = useRef<HTMLTableSectionElement>(null);
  const [scrollLock, setScrollLock] = useState(false);

  const handleTableScroll = () => {
    if (tableBodyRef.current) {
      setScrollLock(tableBodyRef.current.scrollLeft > 0);
    }
  };

  const getCompanySizeLabel = (size: string | null | undefined) => {
    if (!size) return "-";
    
    const sizeMap: Record<string, string> = {
      "1-10": "1-10 employees",
      "11-50": "11-50 employees",
      "51-200": "51-200 employees",
      "201-500": "201-500 employees",
      "501-1000": "501-1000 employees",
      "1001-5000": "1001-5000 employees",
      "5001-10000": "5001-10000 employees",
      "10001+": "10001+ employees"
    };
    
    return sizeMap[size] || size;
  };

  const getIndustryColor = (industry: string | null | undefined) => {
    if (!industry) return "bg-neutral-100 text-neutral-800";
    
    const industryMap: Record<string, string> = {
      "technology": "bg-blue-100 text-blue-800",
      "healthcare": "bg-green-100 text-green-800",
      "finance": "bg-amber-100 text-amber-800",
      "manufacturing": "bg-orange-100 text-orange-800",
      "retail": "bg-purple-100 text-purple-800",
      "education": "bg-teal-100 text-teal-800",
      "consulting": "bg-indigo-100 text-indigo-800",
      "software": "bg-sky-100 text-sky-800"
    };
    
    return industryMap[industry.toLowerCase()] || "bg-neutral-100 text-neutral-800";
  };

  return (
    <div className="overflow-hidden border rounded-lg">
      <div
        className={`overflow-x-auto max-h-[650px] ${
          scrollLock ? "overflow-y-hidden" : "overflow-y-auto"
        }`}
        onScroll={handleTableScroll}
      >
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-white dark:bg-neutral-950">
            <TableRow>
              <TableHead className="min-w-[240px] sticky left-0 z-20 bg-white dark:bg-neutral-950">Company</TableHead>
              <TableHead className="min-w-[150px]">Industry</TableHead>
              <TableHead className="min-w-[180px]">Location</TableHead>
              <TableHead className="min-w-[180px]">Size</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody ref={tableBodyRef}>
            {companies.map((company) => (
              <TableRow key={company.id}>
                <TableCell className="sticky left-0 z-10 bg-white dark:bg-neutral-950">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-md bg-primary-100 text-primary-700 flex items-center justify-center mr-3">
                      <Building2 size={16} />
                    </div>
                    <div>
                      <div 
                        className="font-medium hover:text-primary-600 cursor-pointer"
                        onClick={() => onViewCompany(company)}
                      >
                        {company.name}
                      </div>
                      {company.website && (
                        <a 
                          href={company.website.startsWith('http') ? company.website : `https://${company.website}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-xs text-primary-500 hover:underline flex items-center mt-1"
                        >
                          <Globe size={10} className="mr-1" />
                          {company.website.replace(/^https?:\/\//, '')}
                        </a>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {company.industry ? (
                    <Badge variant="outline" className={getIndustryColor(company.industry)}>
                      {company.industry}
                    </Badge>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  {company.location ? (
                    <div className="flex items-center">
                      <MapPin size={14} className="mr-1 text-neutral-500" />
                      {company.location}
                    </div>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>{getCompanySizeLabel(company.size)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onViewContacts(company)}
                    >
                      <Users size={16} className="text-neutral-500" />
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal size={16} className="text-neutral-500" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewCompany(company)}>
                          <FileText className="mr-2 h-4 w-4" />
                          <span>View Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onViewContacts(company)}>
                          <Users className="mr-2 h-4 w-4" />
                          <span>View Contacts</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEditCompany(company)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit Company</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDeleteCompany(company)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete Company</span>
                        </DropdownMenuItem>
                        {company.website && (
                          <DropdownMenuItem asChild>
                            <a
                              href={company.website.startsWith('http') ? company.website : `https://${company.website}`} 
                              target="_blank" 
                              rel="noreferrer"
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              <span>Visit Website</span>
                            </a>
                          </DropdownMenuItem>
                        )}
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
  );
}