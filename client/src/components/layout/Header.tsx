import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/lib/auth";
import { Search, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CreditsIndicator } from "@/components/billing/CreditsIndicator";
import { NotificationsPopover } from "@/components/notifications/NotificationsPopover";
import { UserDropdown } from "@/components/profile/UserDropdown";

export function Header({ toggleSidebar }: { toggleSidebar: () => void }) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log(`Searching for: ${searchQuery}`);
    }
  };

  return (
    <header className="bg-white border-b border-neutral-200 fixed w-full z-[80] shadow-sm">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-neutral-600 hover:bg-neutral-100 lg:hidden"
          >
            <Menu size={20} />
          </button>
          <Link href="/dashboard">
            <span className="ml-2 font-bold text-lg text-primary-600">AI-CRM</span>
          </Link>
        </div>

        <div className="hidden md:block flex-1 max-w-xl mx-4">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contacts, companies, or messages..."
              className="w-full pl-10"
            />
            <Search size={16} className="absolute left-3 top-2.5 text-neutral-400" />
          </form>
        </div>

        <div className="flex items-center space-x-3">
          <CreditsIndicator />
          <NotificationsPopover />
          <UserDropdown />
        </div>
      </div>
    </header>
  );
}
