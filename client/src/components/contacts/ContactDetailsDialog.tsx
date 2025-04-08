import React from "react";
import { Contact } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Mail,
  Phone,
  MapPin,
  Building,
  Globe,
  Calendar,
  Linkedin,
  Twitter,
  Facebook,
  MessageSquare,
  FileText,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ContactDetailsDialogProps {
  contact: Contact | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (contact: Contact) => void;
}

export function ContactDetailsDialog({
  contact,
  open,
  onOpenChange,
  onEdit,
}: ContactDetailsDialogProps) {
  if (!contact) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Generate avatar background color based on name
  const getRandomColor = (name: string) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-yellow-500",
      "bg-pink-500",
      "bg-indigo-500",
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl min-h-[500px] p-0">
        <div className="flex flex-col md:flex-row h-full">
          {/* Left sidebar with contact basic info */}
          <div className="w-full md:w-1/3 bg-muted/30 p-6 flex flex-col">
            <div className="flex flex-col items-center mb-6">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarFallback className={getRandomColor(contact.fullName)}>
                  {getInitials(contact.fullName)}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-bold">{contact.fullName}</h3>
              <p className="text-muted-foreground">{contact.jobTitle || "No title"}</p>
              <p className="text-sm text-muted-foreground">
                at {contact.companyName || "Unknown company"}
              </p>
              {contact.location && (
                <div className="flex items-center mt-2 text-sm">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  <span>{contact.location}</span>
                </div>
              )}
            </div>

            <div className="space-y-4 mt-4">
              {contact.email && (
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-3 text-muted-foreground" />
                  <span className="text-sm break-all">{contact.email}</span>
                </div>
              )}
              {contact.phone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-3 text-muted-foreground" />
                  <span className="text-sm">{contact.phone}</span>
                </div>
              )}
              {/* Website field not in the contact schema */}
              {contact.linkedInUrl && (
                <div className="flex items-center">
                  <Linkedin className="h-4 w-4 mr-3 text-muted-foreground" />
                  <span className="text-sm break-all">{contact.linkedInUrl}</span>
                </div>
              )}
            </div>
            
            <div className="mt-8">
              {contact.tags && contact.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {contact.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">{tag}</Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-auto pt-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => onEdit && contact && onEdit(contact)}
              >
                Edit Contact
              </Button>
            </div>
          </div>

          {/* Right content area with tabs */}
          <div className="w-full md:w-2/3 p-6">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="company">Company</TabsTrigger>
                <TabsTrigger value="connections">Connections</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">Contact Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Full Name</p>
                        <p>{contact.fullName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Job Title</p>
                        <p>{contact.jobTitle || "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p>{contact.email || "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p>{contact.phone || "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Location</p>
                        <p>{contact.location || "—"}</p>
                      </div>
                      {/* Website field is not in the contact schema */}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">Social Profiles</h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">LinkedIn</p>
                        <p className="break-all">{contact.linkedInUrl || "—"}</p>
                      </div>
                      {/* Add other social profiles here if needed */}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="company" className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Company Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Company Name</p>
                      <p>{contact.companyName || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Industry</p>
                      <p>{contact.industry || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Team Size</p>
                      <p>{contact.teamSize || "—"}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="connections" className="space-y-4">
                <div className="text-center text-muted-foreground py-8">
                  <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No connection history available</p>
                </div>
              </TabsContent>

              <TabsContent value="notes" className="space-y-4">
                <div className="border rounded-md p-4 min-h-[200px]">
                  {contact.notes ? (
                    <p className="whitespace-pre-wrap">{contact.notes}</p>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No notes available</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}