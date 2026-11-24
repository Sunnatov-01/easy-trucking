"use client";

import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut, ChevronRight } from "lucide-react";

interface HeaderProps {
  user?: {
    name?: string | null;
    email?: string | null;
    role?: string;
    department?: string | null;
  };
  companyName?: string;
}

export function Header({ companyName }: HeaderProps) {
  const pathname = usePathname();

  // Compute clean breadcrumb / title
  const titleMap: Record<string, string> = {
    "/dashboard": "Operations Overview",
    "/dashboard/loads": "Load Update List",
    "/dashboard/drivers": "Driver Fleet Directory",
    "/dashboard/team": "Team Approvals & Roles",
    "/dashboard/logs": "System Activity Log",
    "/dashboard/profile": "Account Profile & Settings",
  };

  const currentTitle = titleMap[pathname] || "Dashboard";

  return (
    <header className="h-18 bg-white border-b border-slate-200/80 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-40">
      {/* Left Breadcrumb */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-400">
          {companyName || "Easy Trucking"}
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <h1 className="text-sm font-bold text-slate-900 tracking-tight">
          {currentTitle}
        </h1>
      </div>

      {/* Right Action: Clean Minimalist Sign Out Button */}
      <div className="flex items-center">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50/80 border border-slate-200/80 hover:border-red-200/80 transition-all duration-150"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
