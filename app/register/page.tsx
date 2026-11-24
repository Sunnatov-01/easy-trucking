"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  Users,
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Hash,
} from "lucide-react";
import { BrandLogo } from "@/src/components/BrandLogo";
import { DepartmentSelect } from "@/src/components/DepartmentSelect";

export default function RegisterPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"company" | "employee">("company");

  // Company Form State
  const [companyForm, setCompanyForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showCompanyPassword, setShowCompanyPassword] = useState(false);
  const [companyLoading, setCompanyLoading] = useState(false);
  const [companyError, setCompanyError] = useState("");

  // Employee Form State
  const [employeeForm, setEmployeeForm] = useState({
    name: "",
    email: "",
    password: "",
    companyCode: "",
    department: "DISPATCHER",
  });
  const [showEmployeePassword, setShowEmployeePassword] = useState(false);
  const [employeeLoading, setEmployeeLoading] = useState(false);
  const [employeeError, setEmployeeError] = useState("");

  // Handle Register Company
  async function handleCompanySubmit(e: React.FormEvent) {
    e.preventDefault();
    setCompanyLoading(true);
    setCompanyError("");

    try {
      const res = await fetch("/api/auth/register/company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(companyForm),
      });

      const data = await res.json();
      setCompanyLoading(false);

      if (!res.ok) {
        setCompanyError(
          data.error || "Unable to register company. Please try again."
        );
        return;
      }

      router.push(
        `/login?registered=1&email=${encodeURIComponent(companyForm.email)}`
      );
    } catch {
      setCompanyLoading(false);
      setCompanyError("Network error. Please try again later.");
    }
  }

  // Handle Join Employee
  async function handleEmployeeSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmployeeLoading(true);
    setEmployeeError("");

    try {
      const res = await fetch("/api/auth/register/employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employeeForm),
      });

      const data = await res.json();
      setEmployeeLoading(false);

      if (!res.ok) {
        setEmployeeError(
          data.error || "Failed to submit request. Please check the company code."
        );
        return;
      }

      router.push("/pending");
    } catch {
      setEmployeeLoading(false);
      setEmployeeError("Network error. Please try again later.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8 selection:bg-blue-100 selection:text-blue-900">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[760px] h-[450px] bg-gradient-to-b from-blue-100/50 via-indigo-50/30 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="mb-7 flex flex-col items-center">
          <BrandLogo size="md" layout="stacked" showTagline={true} />
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-900/5 border border-slate-200/80">
          {/* Segmented Tab Switcher */}
          <div className="grid grid-cols-2 p-1.5 mb-7 bg-slate-100/80 rounded-2xl gap-1">
            <button
              type="button"
              onClick={() => setActiveTab("company")}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeTab === "company"
                  ? "bg-white text-slate-900 shadow-sm shadow-slate-200/80"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Register Company</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("employee")}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeTab === "employee"
                  ? "bg-white text-slate-900 shadow-sm shadow-slate-200/80"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Join as Employee</span>
            </button>
          </div>

          {/* TAB 1: Register Company */}
          {activeTab === "company" && (
            <form onSubmit={handleCompanySubmit} className="space-y-4">
              {companyError && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
                  <span className="leading-relaxed">{companyError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Carrier / Company Name
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={companyForm.name}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, name: e.target.value })
                    }
                    placeholder="e.g. Navaship Freight LLC"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Admin Work Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={companyForm.email}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, email: e.target.value })
                    }
                    placeholder="owner@yourcompany.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Admin Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showCompanyPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={companyForm.password}
                    onChange={(e) =>
                      setCompanyForm({
                        ...companyForm,
                        password: e.target.value,
                      })
                    }
                    placeholder="At least 8 characters"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowCompanyPassword(!showCompanyPassword)
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showCompanyPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-100 flex items-start gap-2.5 text-xs text-blue-900 leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>
                  Instantly creates your company and auto-generates your unique{" "}
                  <strong>Company Code</strong> (e.g. NAVA-4921) to invite staff.
                </span>
              </div>

              <button
                type="submit"
                disabled={companyLoading}
                className="w-full mt-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {companyLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Company...</span>
                  </>
                ) : (
                  <>
                    <span>Register Company</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 2: Join as Employee */}
          {activeTab === "employee" && (
            <form onSubmit={handleEmployeeSubmit} className="space-y-4">
              {employeeError && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
                  <span className="leading-relaxed">{employeeError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={employeeForm.name}
                    onChange={(e) =>
                      setEmployeeForm({ ...employeeForm, name: e.target.value })
                    }
                    placeholder="e.g. Alex Miller"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Work Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={employeeForm.email}
                    onChange={(e) =>
                      setEmployeeForm({
                        ...employeeForm,
                        email: e.target.value,
                      })
                    }
                    placeholder="alex@trucking.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showEmployeePassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={employeeForm.password}
                    onChange={(e) =>
                      setEmployeeForm({
                        ...employeeForm,
                        password: e.target.value,
                      })
                    }
                    placeholder="At least 8 characters"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowEmployeePassword(!showEmployeePassword)
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showEmployeePassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Company Code
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={employeeForm.companyCode}
                    onChange={(e) =>
                      setEmployeeForm({
                        ...employeeForm,
                        companyCode: e.target.value.toUpperCase(),
                      })
                    }
                    placeholder="CODE-1234"
                    className="w-full pl-10 pr-4 py-2.5 font-mono uppercase tracking-wider bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all"
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  Obtain this 8-character code from your fleet manager or owner.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Department
                </label>
                {/* Custom Animated Department Dropdown */}
                <DepartmentSelect
                  value={employeeForm.department}
                  onChange={(val) =>
                    setEmployeeForm({ ...employeeForm, department: val })
                  }
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-500">
                Employee accounts require approval from the carrier owner before access is granted.
              </div>

              <button
                type="submit"
                disabled={employeeLoading}
                className="w-full mt-2 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold shadow-md shadow-slate-900/15 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {employeeLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Join Request</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer Navigation */}
        <p className="mt-8 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center gap-1"
          >
            <span>Sign in</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </p>
      </div>
    </div>
  );
}
