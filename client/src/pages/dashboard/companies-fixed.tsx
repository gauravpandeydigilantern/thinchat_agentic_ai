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
import CompaniesTable from "@/components/companies/CompaniesTable-fixed";
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

// CompanyForm component
interface CompanyFormProps {
  form: any;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

function CompanyForm({ form, onSubmit, isSubmitting }: CompanyFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name *</FormLabel>
              <FormControl>
                <Input placeholder="Enter company name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
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
                  value={field.value}
                  onValueChange={field.onChange}
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input placeholder="Enter company website" {...field} />
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
                  <Input placeholder="Enter location" {...field} />
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
                  placeholder="Enter company description" 
                  className="resize-none min-h-[100px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {form.formState.defaultValues?.name ? "Update Company" : "Create Company"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

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
      return await apiRequest("/api/companies", {
        method: "POST",
        body: JSON.stringify(company)
      });
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
      return await apiRequest(`/api/companies/${id}`, {
        method: "PATCH",
        body: JSON.stringify(company)
      });
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
      return await apiRequest(`/api/companies/${id}`, {
        method: "DELETE"
      });
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
              onEditCompany={(company) => setSelectedCompany(company)}
              onDeleteCompany={(company) => {
                setSelectedCompany(company);
                setIsDeleteDialogOpen(true);
              }}
              onViewDetails={(company) => {
                // View details functionality would go here
              }}
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
      </Card>
      
      {/* Edit Company Dialog */}
      {selectedCompany && (
        <Dialog open={!!selectedCompany && !isDeleteDialogOpen} onOpenChange={(open) => {
          if (!open) setSelectedCompany(null);
        }}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Edit Company</DialogTitle>
              <DialogDescription>
                Update company information
              </DialogDescription>
            </DialogHeader>
            
            <CompanyForm 
              form={form} 
              onSubmit={(data) => updateCompanyMutation.mutate({ 
                id: selectedCompany.id, 
                company: data 
              })}
              isSubmitting={updateCompanyMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      )}
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Company</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedCompany?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteCompanyMutation.mutate(selectedCompany!.id)}
              disabled={deleteCompanyMutation.isPending}
            >
              {deleteCompanyMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}