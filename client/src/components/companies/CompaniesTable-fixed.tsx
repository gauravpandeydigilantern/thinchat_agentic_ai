import React, { useState } from "react";
import { Company } from "@shared/schema";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Building2, 
  Edit, 
  ExternalLink, 
  Globe, 
  MoreHorizontal, 
  Map, 
  Trash2
} from "lucide-react";

interface CompaniesTableProps {
  companies: Company[];
  onEditCompany: (company: Company) => void;
  onDeleteCompany: (company: Company) => void;
  onViewDetails?: (company: Company) => void;
}

export default function CompaniesTable({
  companies,
  onEditCompany,
  onDeleteCompany,
  onViewDetails
}: CompaniesTableProps) {
  // Function to truncate text
  const truncate = (text: string | null | undefined, maxLength: number = 50) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  // Fix for table scrolling: Adding fixed height container that scrolls
  return (
    <div className="relative w-full border rounded-md overflow-hidden">
      <div className="max-h-[450px] overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Size</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <Building2 className="mr-2 h-4 w-4 text-neutral-400" />
                    <div>
                      <div>
                        {company.name}
                      </div>
                      {company.website && (
                        <a 
                          href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-neutral-500 hover:text-primary flex items-center mt-1"
                        >
                          <Globe className="mr-1 h-3 w-3" />
                          {truncate(company.website, 25)}
                        </a>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {company.industry && (
                    <Badge variant="outline">{company.industry}</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {company.location && (
                    <div className="flex items-center">
                      <Map className="mr-1 h-3 w-3 text-neutral-400" />
                      <span>{company.location}</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {company.size && (
                    <span className="text-sm">{company.size}</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {onViewDetails && (
                        <DropdownMenuItem onClick={() => onViewDetails(company)}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => onEditCompany(company)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDeleteCompany(company)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
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
    </div>
  );
}