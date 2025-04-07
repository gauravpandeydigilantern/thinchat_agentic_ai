import React, { useState } from "react";
import { Company } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Building2, 
  MapPin, 
  Users, 
  Globe, 
  FileText, 
  User, 
  Mail, 
  Calendar, 
  Briefcase,
  XCircle, 
  ExternalLink, 
  Clock,
  Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CompanyDetailsDialogProps {
  company: Company | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CompanyDetailsDialog({
  company,
  isOpen,
  onClose
}: CompanyDetailsDialogProps) {
  const [activeTab, setActiveTab] = useState("profile");
  
  // Fetch contacts associated with this company
  const { data: contactsData, isLoading: isLoadingContacts } = useQuery({
    queryKey: ["/api/contacts", { companyId: company?.id }],
    queryFn: async () => {
      if (!company) return { contacts: [] };
      
      const res = await fetch(`/api/contacts?companyId=${company.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`
        }
      });
      
      if (!res.ok) throw new Error("Failed to fetch contacts");
      return res.json();
    },
    enabled: !!company && isOpen && activeTab === "contacts"
  });
  
  if (!company || !isOpen) return null;
  
  // Format date if available
  const formatDate = (date: Date | null | undefined): string => {
    if (!date) return "Not specified";
    
    try {
      return format(new Date(date), "MMM d, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };
  
  // Get company size label
  const getCompanySizeLabel = (size: string | null | undefined) => {
    if (!size) return "Not specified";
    
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
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex items-start space-x-4">
              <div className="h-12 w-12 rounded-md bg-primary-100 text-primary-700 flex items-center justify-center mt-1">
                <Building2 size={24} />
              </div>
              <div>
                <DialogTitle className="text-xl">{company.name}</DialogTitle>
                <DialogDescription className="mt-1 flex items-center">
                  {company.industry ? (
                    <Badge variant="outline" className="mr-2">
                      {company.industry}
                    </Badge>
                  ) : null}
                  {company.location && (
                    <span className="flex items-center text-sm text-muted-foreground">
                      <MapPin size={12} className="mr-1" />
                      {company.location}
                    </span>
                  )}
                </DialogDescription>
              </div>
            </div>
            
            <div className="flex space-x-2">
              {company.website && (
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center"
                  >
                    <Globe size={14} className="mr-1" />
                    Visit Website
                  </a>
                </Button>
              )}
              <Button variant="outline" size="sm" asChild>
                <a href={`/dashboard/contacts?company=${company.id}`}>
                  <Users size={14} className="mr-1" />
                  View Contacts
                </a>
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="flex-1 min-h-0">
          <TabsList>
            <TabsTrigger value="profile">
              <Building2 size={14} className="mr-1" /> Profile
            </TabsTrigger>
            <TabsTrigger value="contacts">
              <Users size={14} className="mr-1" /> Contacts
            </TabsTrigger>
            <TabsTrigger value="notes">
              <FileText size={14} className="mr-1" /> Notes
            </TabsTrigger>
            <TabsTrigger value="timeline">
              <Clock size={14} className="mr-1" /> Timeline
            </TabsTrigger>
          </TabsList>
          
          <ScrollArea className="mt-4 flex-1">
            <TabsContent value="profile" className="m-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Company Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {company.description ? (
                      <div className="mb-4">
                        <p className="text-sm">{company.description}</p>
                      </div>
                    ) : (
                      <div className="mb-4 text-center py-6 border border-dashed rounded-lg">
                        <XCircle size={24} className="mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">No company description available</p>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-4">
                      <div>
                        <div className="font-medium mb-1">Size</div>
                        <div>{getCompanySizeLabel(company.size)}</div>
                      </div>
                      <div>
                        <div className="font-medium mb-1">Industry</div>
                        <div>{company.industry || "Not specified"}</div>
                      </div>
                      <div>
                        <div className="font-medium mb-1">Location</div>
                        <div>{company.location || "Not specified"}</div>
                      </div>
                      <div>
                        <div className="font-medium mb-1">Website</div>
                        <div>
                          {company.website ? (
                            <a 
                              href={company.website.toString().startsWith('http') ? company.website.toString() : `https://${company.website}`} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-primary-500 hover:underline flex items-center"
                            >
                              {company.website.toString().replace(/^https?:\/\//, '')}
                              <ExternalLink size={12} className="ml-1" />
                            </a>
                          ) : (
                            "Not specified"
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium mb-1">Created At</div>
                        <div>{company.createdAt ? formatDate(new Date(company.createdAt)) : "Not available"}</div>
                      </div>
                      <div>
                        <div className="font-medium mb-1">Last Updated</div>
                        <div>{company.timestamp ? formatDate(new Date(company.timestamp)) : "Not available"}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center mr-3">
                          <Users size={16} />
                        </div>
                        <div>
                          <div className="text-sm font-medium">Contacts</div>
                          <div className="text-xs text-muted-foreground">Associated contacts</div>
                        </div>
                      </div>
                      <div className="text-xl font-semibold">
                        {isLoadingContacts ? "..." : contactsData?.contacts?.length || 0}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center mr-3">
                          <Mail size={16} />
                        </div>
                        <div>
                          <div className="text-sm font-medium">Emails</div>
                          <div className="text-xs text-muted-foreground">Email campaigns</div>
                        </div>
                      </div>
                      <div className="text-xl font-semibold">0</div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-md bg-green-100 text-green-700 flex items-center justify-center mr-3">
                          <Briefcase size={16} />
                        </div>
                        <div>
                          <div className="text-sm font-medium">Opportunities</div>
                          <div className="text-xs text-muted-foreground">Open deals</div>
                        </div>
                      </div>
                      <div className="text-xl font-semibold">0</div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center mr-3">
                          <Tag size={16} />
                        </div>
                        <div>
                          <div className="text-sm font-medium">Tags</div>
                          <div className="text-xs text-muted-foreground">Applied tags</div>
                        </div>
                      </div>
                      <div className="text-xl font-semibold">0</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="contacts" className="m-0">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Associated Contacts</CardTitle>
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/dashboard/contacts?company=${company.id}`}>
                        <Users size={14} className="mr-1" />
                        View All
                      </a>
                    </Button>
                  </div>
                  <CardDescription>
                    People associated with {company.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingContacts ? (
                    <div className="py-8 text-center">
                      <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                      <p className="text-sm text-muted-foreground">Loading contacts...</p>
                    </div>
                  ) : contactsData?.contacts?.length > 0 ? (
                    <div className="divide-y">
                      {contactsData.contacts.map((contact: any) => (
                        <div key={contact.id} className="py-3 flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-neutral-100 text-neutral-700 flex items-center justify-center mr-3">
                              <User size={14} />
                            </div>
                            <div>
                              <div className="font-medium">{contact.fullName}</div>
                              <div className="text-xs text-muted-foreground">{contact.jobTitle || "Unknown position"}</div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <a href={`/dashboard/contacts?id=${contact.id}`}>View</a>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center border border-dashed rounded-lg">
                      <XCircle size={24} className="mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">No contacts associated with this company</p>
                      <Button variant="link" asChild className="mt-2">
                        <a href="/dashboard/contacts/new">Add a contact</a>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notes" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Notes</CardTitle>
                  <CardDescription>
                    Notes and comments about {company.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="py-8 text-center border border-dashed rounded-lg">
                    <FileText size={24} className="mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No notes available yet</p>
                    <Button variant="link" className="mt-2">
                      Add a note
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="timeline" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Activity Timeline</CardTitle>
                  <CardDescription>
                    Recent activities related to {company.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="py-8 text-center border border-dashed rounded-lg">
                    <Clock size={24} className="mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No activity recorded yet</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>
        
        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}