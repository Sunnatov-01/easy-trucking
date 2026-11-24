"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Truck,
  Users,
  ShieldCheck,
  History,
  PanelLeftClose,
  PanelLeftOpen,
  Building2,
  Headphones,
  User as UserIcon,
  ChevronRight,
} from "lucide-react";
import { BrandLogo } from "@/src/components/BrandLogo";

interface SidebarProps {
  userRole?: string;
  user?: {
    name?: string | null;
    email?: string | null;
    role?: string;
    department?: string | null;
  };
  companyName?: string | null;
}

export function Sidebar({ userRole, user, companyName }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Sync initial state from localStorage after mount to avoid SSR hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem("easy_trucking_sidebar_collapsed");
      if (saved !== null) {
        setIsCollapsed(saved === "true");
      }
    } catch {
      // Ignore if localStorage is disabled or restricted
    }
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("easy_trucking_sidebar_collapsed", String(next));
      } catch {
        // Ignore errors saving to localStorage
      }
      return next;
    });
  };

  const navigation = [
    {
      name: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: "Update List",
      href: "/dashboard/loads",
      icon: Truck,
      exact: false,
    },
    {
      name: "Drivers",
      href: "/dashboard/drivers",
      icon: Users,
      exact: false,
    },
    ...(userRole === "COMPANY" || user?.role === "COMPANY"
      ? [
          {
            name: "Team & Approvals",
            href: "/dashboard/team",
            icon: ShieldCheck,
            exact: false,
          },
        ]
      : []),
    {
      name: "Activity Log",
      href: "/dashboard/logs",
      icon: History,
      exact: false,
    },
  ];

  function isActive(href: string, exact: boolean) {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  }

  const isProfileActive = pathname === "/dashboard/profile";

  // User display metadata & avatar initials
  const displayName = user?.name || companyName || "Easy Trucking";
  const initials = (user?.name || companyName || "ET")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("") || "ET";

  function getRoleBadge() {
    const role = user?.role || userRole;
    if (role === "COMPANY") {
      return {
        label: "Carrier Owner",
        icon: Building2,
        className: "bg-blue-50 text-blue-700 border-blue-200/80",
      };
    }
    if (user?.department) {
      return {
        label: user.department,
        icon: Headphones,
        className: "bg-indigo-50 text-indigo-700 border-indigo-200/80",
      };
    }
    return {
      label: "Staff",
      icon: UserIcon,
      className: "bg-slate-100 text-slate-700 border-slate-200",
    };
  }

  const roleBadge = getRoleBadge();
  const RoleIcon = roleBadge.icon;

  return (
    <aside
      className={`relative bg-white border-r border-slate-200/80 flex flex-col justify-between h-screen sticky top-0 flex-shrink-0 select-none z-30 transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-[76px]" : "w-64"
      }`}
    >
      <div className="flex flex-col">
        {/* Header / Brand Logo Section with Single Clean Toggle Button */}
        <div
          className={`border-b border-slate-100 transition-all duration-300 flex items-center ${
            isCollapsed
              ? "flex-col justify-center py-3 gap-2"
              : "h-18 px-4 justify-between"
          }`}
        >
          <Link
            href="/dashboard"
            className="flex items-center justify-center overflow-hidden"
            title="Easy Trucking Dashboard"
          >
            <BrandLogo
              size="sm"
              layout="horizontal"
              showTagline={false}
              hideText={isCollapsed}
            />
          </Link>
          <button
            type="button"
            onClick={toggleSidebar}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="p-1.5 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors flex items-center justify-center flex-shrink-0"
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav
          className={`transition-all duration-300 ${
            isCollapsed ? "p-2.5 space-y-2" : "p-3.5 space-y-1"
          }`}
        >
          {!isCollapsed ? (
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 transition-opacity duration-200">
              Dispatch Center
            </div>
          ) : (
            <div className="w-8 h-px bg-slate-100 mx-auto my-1" />
          )}

          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);

            if (isCollapsed) {
              return (
                <div key={item.name} className="flex justify-center">
                  <Link
                    href={item.href}
                    className={`group relative flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-200 ${
                      active
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 flex-shrink-0 transition-colors ${
                        active
                          ? "text-white"
                          : "text-slate-500 group-hover:text-slate-900"
                      }`}
                      strokeWidth={active ? 2.4 : 2}
                    />

                    {/* Dark-slate floating tooltip to the right of the icon */}
                    <div className="pointer-events-none absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50 whitespace-nowrap">
                      <div className="bg-slate-900 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg shadow-lg flex items-center">
                        {item.name}
                      </div>
                    </div>
                  </Link>
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-150 ${
                  active
                    ? "bg-blue-50 text-blue-700 shadow-xs shadow-blue-500/5 font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                }`}
              >
                <Icon
                  className={`w-4 h-4 flex-shrink-0 transition-colors ${
                    active ? "text-blue-600" : "text-slate-400"
                  }`}
                  strokeWidth={active ? 2.4 : 2}
                />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer User Account Card (Clickable to /dashboard/profile) */}
      {isCollapsed ? (
        <div className="mt-auto m-2.5 flex justify-center">
          <Link
            href="/dashboard/profile"
            className={`group relative flex items-center justify-center p-1.5 rounded-xl transition-all cursor-pointer ${
              isProfileActive
                ? "bg-blue-50 ring-2 ring-blue-500/30"
                : "hover:bg-slate-100/80"
            }`}
          >
            {/* Centered Circular Avatar Badge */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-200/70 shadow-xs flex-shrink-0 select-none">
              {initials}
            </div>

            {/* Dark floating hover tooltip displaying user name, email, and role */}
            <div className="pointer-events-none absolute left-[calc(100%+14px)] bottom-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50 whitespace-nowrap">
              <div className="bg-slate-900 text-white text-xs font-medium px-3 py-2.5 rounded-xl shadow-xl flex flex-col gap-1 border border-slate-800">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-bold text-white text-xs">
                    {displayName}
                  </span>
                  <span className="text-[10px] text-blue-300 font-medium">
                    Profile & Settings
                  </span>
                </div>
                {user?.email && (
                  <span className="text-[11px] text-slate-400 font-normal">
                    {user.email}
                  </span>
                )}
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    <RoleIcon className="w-2.5 h-2.5" />
                    <span>{roleBadge.label}</span>
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ) : (
        <div className="mt-auto p-3 m-3">
          <Link
            href="/dashboard/profile"
            className={`group flex items-center gap-3 p-3 rounded-2xl border transition-all duration-150 cursor-pointer ${
              isProfileActive
                ? "bg-blue-50/70 border-blue-200 ring-2 ring-blue-500/20 shadow-xs"
                : "bg-slate-50/90 border-slate-200/70 hover:bg-slate-100/80 hover:border-slate-300/80"
            }`}
          >
            {/* Rounded Avatar Badge */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-200/60 shadow-xs flex-shrink-0 select-none">
              {initials}
            </div>

            {/* User / Company Name & Email */}
            <div className="min-w-0 flex-1">
              <p
                className="text-xs font-bold text-slate-900 truncate"
                title={displayName}
              >
                {displayName}
              </p>
              <p
                className="text-[11px] text-slate-500 truncate"
                title={user?.email || ""}
              >
                {user?.email || "No email"}
              </p>
              <div className="mt-1">
                <span
                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold border leading-tight ${roleBadge.className}`}
                >
                  <RoleIcon className="w-2.5 h-2.5" />
                  <span>{roleBadge.label}</span>
                </span>
              </div>
            </div>

            {/* Subtle Chevron indicator on the right */}
            <ChevronRight
              className={`w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all flex-shrink-0 ${
                isProfileActive ? "text-blue-600" : ""
              }`}
            />
          </Link>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
