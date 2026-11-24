"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  Check,
  Radio,
  Clock,
  BadgeDollarSign,
  ShieldCheck,
  Wrench,
  Users,
  LucideIcon,
} from "lucide-react";

export interface DepartmentOption {
  value: string;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

export const DEPARTMENTS: DepartmentOption[] = [
  {
    value: "DISPATCHER",
    label: "Dispatcher",
    description: "Load booking, rate negotiation & tracking",
    icon: Radio,
    color: "text-blue-600 bg-blue-50 border-blue-200/60",
  },
  {
    value: "UPDATER",
    label: "Load Updater",
    description: "Check calls, delivery ETAs & detention",
    icon: Clock,
    color: "text-cyan-600 bg-cyan-50 border-cyan-200/60",
  },
  {
    value: "ACCOUNTING",
    label: "Accounting & Billing",
    description: "Invoices, factoring & driver settlements",
    icon: BadgeDollarSign,
    color: "text-emerald-600 bg-emerald-50 border-emerald-200/60",
  },
  {
    value: "SAFETY",
    label: "Safety & Compliance",
    description: "ELD logs, IFTA & driver qualification",
    icon: ShieldCheck,
    color: "text-amber-600 bg-amber-50 border-amber-200/60",
  },
  {
    value: "FLEET",
    label: "Fleet Maintenance",
    description: "Truck PMs, road repairs & diagnostics",
    icon: Wrench,
    color: "text-violet-600 bg-violet-50 border-violet-200/60",
  },
  {
    value: "HR",
    label: "HR & Recruitment",
    description: "Driver onboarding, payroll & team support",
    icon: Users,
    color: "text-rose-600 bg-rose-50 border-rose-200/60",
  },
];

interface DepartmentSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function DepartmentSelect({
  value,
  onChange,
  className = "",
}: DepartmentSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected =
    DEPARTMENTS.find((d) => d.value === value) || DEPARTMENTS[0];
  const SelectedIcon = selected.icon;

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-50/70 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-2xl text-left transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-7 h-7 rounded-lg border flex items-center justify-center flex-shrink-0 ${selected.color}`}
          >
            <SelectedIcon className="w-4 h-4" />
          </div>
          <div className="truncate">
            <span className="text-sm font-semibold text-slate-900 block truncate">
              {selected.label}
            </span>
          </div>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0 ml-2 ${
            isOpen ? "rotate-180 text-blue-600" : ""
          }`}
        />
      </button>

      {/* Animated Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-2 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-900/10 max-h-72 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Select Your Assigned Department
          </div>

          <div className="space-y-1">
            {DEPARTMENTS.map((dept) => {
              const Icon = dept.icon;
              const isSelected = dept.value === value;

              return (
                <button
                  key={dept.value}
                  type="button"
                  onClick={() => {
                    onChange(dept.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all ${
                    isSelected
                      ? "bg-blue-50/80 text-blue-900"
                      : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg border flex items-center justify-center flex-shrink-0 ${dept.color}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div
                        className={`text-xs font-semibold truncate ${
                          isSelected ? "text-blue-900" : "text-slate-800"
                        }`}
                      >
                        {dept.label}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {dept.description}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 ml-2">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default DepartmentSelect;
