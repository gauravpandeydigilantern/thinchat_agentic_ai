// Enhanced Sidebar Component
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Search,
  Wand2,
  Users,
  Building2,
  Bot,
  ListChecks,
  BarChart3,
  HelpCircle,
  FileText,
  Database
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
export function Sidebar({ isOpen }: { isOpen: boolean }) {
  const [location] = useLocation();

  const { data: contactsData } = useQuery({
    queryKey: ["/api/contacts"],
    queryFn: async () => {
      const res = await fetch("/api/contacts", {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      if (!res.ok) throw new Error("Failed to fetch contacts");
      return res.json();
    },
    staleTime: 60000,
  });

  const { data: companiesData } = useQuery({
    queryKey: ["/api/companies"],
    queryFn: async () => {
      const res = await fetch("/api/companies", {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      if (!res.ok) throw new Error("Failed to fetch companies");
      return res.json();
    },
    staleTime: 60000,
  });

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/enrich", label: "Enrich Data", icon: Wand2 },
    { href: "/dashboard/contacts", label: "My Contacts", icon: Users, count: contactsData?.contacts?.length },
    { href: "/dashboard/companies", label: "Companies", icon: Building2, count: companiesData?.companies?.length },
    { href: "/dashboard/ai-writer", label: "AI Writer", icon: Bot },
    { href: "/dashboard/crm-integrations", label: "CRM Integrations", icon: Database },
    { href: "/dashboard/contact-list", label: "Contact Lists", icon: ListChecks },
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 pt-1 w-64 bg-white border-r border-neutral-200 transform transition-transform duration-300 ease-in-out z-10",
      isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
    )}>
      <div className="h-full flex flex-col">
        {/* <div className="px-4 py-3">
          <Link href="/dashboard/enrich">
            <Button className="w-full flex justify-between items-center bg-primary hover:bg-primary-600 text-white">
              <span className="font-medium">Find Leads</span>
              <Search size={16} />
            </Button>
          </Link>
        </div> */}
         {/* Logo Section */}
         <div className="flex items-center justify-center py-6">
          <img
            src="/assets/logo.png" // Replace with your logo path
            alt="AI GTM Logo"
            className="h-12 w-auto object-contain"
          />
        </div>

        <nav className="flex-1 space-y-1 px-2 py-3 overflow-y-auto custom-scrollbar">
          {navItems.map(({ href, label, icon: Icon, count }) => (
            <Link key={href} href={href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer",
                  location === href
                    ? "bg-neutral-100 text-primary-600 font-semibold"
                    : "text-neutral-600 hover:bg-neutral-100"
                )}
              >
                <Icon size={18} />
                <span>{label}</span>
                {typeof count === 'number' && (
                  <span className={cn(
                    "ml-auto text-xs font-medium px-2 py-0.5 rounded-full",
                    count > 0 ? "bg-primary-100 text-primary-700" : "bg-neutral-200 text-neutral-600"
                  )}>{count}</span>
                )}
              </div>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-neutral-200">
          <div className="bg-neutral-50 p-3 rounded-md">
            <div className="flex items-start">
              <HelpCircle size={20} className="text-yellow-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-neutral-800">Need help?</p>
                <p className="text-xs text-neutral-600">Check our docs or contact support</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 w-full text-xs border border-neutral-300 hover:bg-neutral-100"
            >
              <FileText size={12} className="mr-1" />
              View Docs
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}