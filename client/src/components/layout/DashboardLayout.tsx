import { useState, ReactNode } from "react";
import { useLocation, useRoute } from "wouter";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  const [location] = useLocation();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <Loader2 className="h-10 w-10 text-primary-500 animate-spin" />
        <p className="ml-3 text-neutral-600 text-lg">Loading dashboard...</p>
      </div>
    );
  }

  if (!isAuthenticated && !location.startsWith("/login") && !location.startsWith("/signup")) {
    return null; // Protected route guard in place
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} />
      <main className="ml-0 lg:ml-64 pt-14 transition-all duration-300">
        <div className="p-4 md:p-6" onClick={() => sidebarOpen && setSidebarOpen(false)}>
          {children}
        </div>
      </main>
    </div>
  );
}
