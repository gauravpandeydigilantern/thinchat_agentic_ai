import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Company } from "@shared/schema";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
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
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  MoreHorizontal, 
  Plus, 
  Search, 
  Trash2, 
  Edit, 
  Globe, 
  Building2, 
  FileText, 
  MapPin, 
  X,
  Download,
  Users
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { CompaniesTable } from "@/components/companies/CompaniesTable";
import { CompanyDetailsDialog } from "@/components/companies/CompanyDetailsDialog";

const companyFormSchema = z.object({
  name: z.string().min(2, "Company name is required"),
  industry: z.string().optional().or(z.literal("")),
  website: z.string().optional().or(z.literal("")),
  size: z.string().optional().or(z.literal("")),
  location: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal(""))
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

export default function CompaniesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [viewCompany, setViewCompany] = useState<Company | null>(null);
  
  // Handlers for company actions
  const handleViewCompany = (company: Company) => {
    setViewCompany(company);
    setIsViewDetailsOpen(true);
  };
  
  const handleViewContacts = (company: Company) => {
    window.location.href = `/dashboard/contacts?company=${company.id}`;
  };
  
  const handleEditCompany = (company: Company) => {
    setSelectedCompany(company);
  };
  
  const handleDeleteCompany = (company: Company) => {
    setSelectedCompany(company);
    setIsDeleteDialogOpen(true);
  };
  
  // Get user's companies
  const { data, isLoading } = useQuery({
    queryKey: ["/api/companies"],
    queryFn: async () => {
      const res = await fetch("/api/companies", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`
        }
      });
      if (!res.ok) throw new Error("Failed to fetch companies");
      return res.json();
    }
  });
  
  // Create company mutation
  const createCompanyMutation = useMutation({
    mutationFn: async (company: CompanyFormValues) => {
      const res = await apiRequest("/api/companies", {
        method: "POST", 
        body: JSON.stringify(company)
      });
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
      toast({
        title: "Company created",
        description: "The company has been added successfully",
      });
      setIsCreateDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create company",
        variant: "destructive"
      });
    }
  });
  
  // Update company mutation
  const updateCompanyMutation = useMutation({
    mutationFn: async ({ id, company }: { id: number, company: CompanyFormValues }) => {
      const res = await apiRequest(`/api/companies/${id}`, {
        method: "PATCH",
        body: JSON.stringify(company)
      });
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
      toast({
        title: "Company updated",
        description: "The company has been updated successfully",
      });
      setSelectedCompany(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update company",
        variant: "destructive"
      });
    }
  });
  
  // Delete company mutation
  const deleteCompanyMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest(`/api/companies/${id}`, {
        method: "DELETE"
      });
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
      toast({
        title: "Company deleted",
        description: "The company has been deleted successfully",
      });
      setIsDeleteDialogOpen(false);
      setSelectedCompany(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete company",
        variant: "destructive"
      });
    }
  });
  
  // Form for creating/editing companies
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: selectedCompany?.name || "",
      industry: selectedCompany?.industry || "",
      website: selectedCompany?.website || "",
      size: selectedCompany?.size || "",
      location: selectedCompany?.location || "",
      description: selectedCompany?.description || ""
    }
  });
  
  // Reset form when selected company changes
  useEffect(() => {
    if (selectedCompany) {
      form.reset({
        name: selectedCompany.name,
        industry: selectedCompany.industry || "",
        website: selectedCompany.website || "",
        size: selectedCompany.size || "",
        location: selectedCompany.location || "",
        description: selectedCompany.description || ""
      });
    } else {
      form.reset({
        name: "",
        industry: "",
        website: "",
        size: "",
        location: "",
        description: ""
      });
    }
  }, [selectedCompany, form]);
  
  // Filter companies based on search term
  const filteredCompanies = data?.companies.filter((company: Company) => {
    if (!searchTerm) return true;
    
    const search = searchTerm.toLowerCase();
    return (
      company.name.toLowerCase().includes(search) ||
      (company.industry && company.industry.toLowerCase().includes(search)) ||
      (company.location && company.location.toLowerCase().includes(search))
    );
  });
  
  // Get company size label
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

  // Get industry color
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
    <div>
    
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Companies</CardTitle>
              <CardDescription>
                You have {data?.companies?.length || 0} companies in your database
              </CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-400" />
                <Input
                  placeholder="Search companies..."
                  className="pl-9 w-full sm:w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-neutral-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus size={16} className="mr-2" /> Add Company
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-xl">
                  <DialogHeader>
                    <DialogTitle>Add New Company</DialogTitle>
                    <DialogDescription>
                      Create a new company in your CRM system
                    </DialogDescription>
                  </DialogHeader>
                  
                  <CompanyForm 
                    form={form} 
                    onSubmit={(data) => createCompanyMutation.mutate(data)}
                    isSubmitting={createCompanyMutation.isPending}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
            </div>
          ) : filteredCompanies?.length > 0 ? (
            <CompaniesTable 
              companies={filteredCompanies}
              onViewCompany={handleViewCompany}
              onViewContacts={handleViewContacts}
              onEditCompany={handleEditCompany}
              onDeleteCompany={handleDeleteCompany}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-neutral-500">No companies found</p>
              {searchTerm && (
                <Button 
                  variant="link" 
                  onClick={() => setSearchTerm("")}
                  className="mt-2"
                >
                  Clear search
                </Button>
              )}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between border-t p-4">
          <div className="text-sm text-neutral-500">
            Showing {filteredCompanies?.length || 0} of {data?.companies?.length || 0} companies
          </div>
          
          <Button variant="outline" size="sm">
            <Download size={14} className="mr-1" /> Export Companies
          </Button>
        </CardFooter>
      </Card>
      
      {/* Edit Company Dialog */}
      {selectedCompany && (
        <Dialog 
          open={!!selectedCompany && !isDeleteDialogOpen} 
          onOpenChange={(open) => !open && setSelectedCompany(null)}
        >
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Edit Company</DialogTitle>
              <DialogDescription>
                Update information for {selectedCompany.name}
              </DialogDescription>
            </DialogHeader>
            
            <CompanyForm 
              form={form} 
              onSubmit={(data) => updateCompanyMutation.mutate({ id: selectedCompany.id, company: data })}
              isSubmitting={updateCompanyMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      )}
      
      {/* Delete Company Confirmation */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Company</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this company? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-neutral-50 dark:bg-neutral-900 rounded-md p-4 my-2">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-md bg-primary-100 text-primary-700 flex items-center justify-center mr-3">
                <Building2 size={16} />
              </div>
              <div>
                <div className="font-medium">{selectedCompany?.name}</div>
                {selectedCompany?.industry && (
                  <Badge variant="outline" className="mt-1 text-xs">
                    {selectedCompany.industry}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedCompany(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedCompany && deleteCompanyMutation.mutate(selectedCompany.id)}
              disabled={deleteCompanyMutation.isPending}
            >
              {deleteCompanyMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Company"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Company Details Dialog */}
      <CompanyDetailsDialog
        company={viewCompany}
        isOpen={isViewDetailsOpen}
        onClose={() => {
          setIsViewDetailsOpen(false);
          setViewCompany(null);
        }}
      />
    </div>
  );
}

// Company Form Component
function CompanyForm({ 
  form, 
  onSubmit, 
  isSubmitting 
}: { 
  form: any, 
  onSubmit: (data: CompanyFormValues) => void,
  isSubmitting: boolean
}) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Enter company name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an industry" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="Retail">Retail</SelectItem>
                    <SelectItem value="Consulting">Consulting</SelectItem>
                    <SelectItem value="Software">Software</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Size</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1-10">1-10 employees</SelectItem>
                    <SelectItem value="11-50">11-50 employees</SelectItem>
                    <SelectItem value="51-200">51-200 employees</SelectItem>
                    <SelectItem value="201-500">201-500 employees</SelectItem>
                    <SelectItem value="501-1000">501-1000 employees</SelectItem>
                    <SelectItem value="1001-5000">1001-5000 employees</SelectItem>
                    <SelectItem value="5001-10000">5001-10000 employees</SelectItem>
                    <SelectItem value="10001+">10001+ employees</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. www.company.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. New York, NY" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe the company" 
                  className="min-h-[100px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Company"
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}