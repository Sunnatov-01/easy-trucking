"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Clock,
  RefreshCw,
  LogOut,
  Building2,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";
import { BrandLogo } from "@/src/components/BrandLogo";

export default function PendingPage() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  async function handleRefresh() {
    setRefreshing(true);
    setStatusMessage("");

    try {
      const res = await fetch("/api/auth/session");
      const session = await res.json();

      if (session?.user?.status === "ACTIVE") {
        router.push("/dashboard");
        return;
      }

      setStatusMessage(
        "Your account is still awaiting approval from your fleet administrator."
      );
    } catch {
      setStatusMessage("Could not verify status. Please try again.");
    } finally {
      setRefreshing(false);
    }
  }

  async function handleSignOut() {
    await signOut({ callbackUrl: "/login" });
  }

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8 selection:bg-blue-100 selection:text-blue-900">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[760px] h-[450px] bg-gradient-to-b from-amber-100/50 via-slate-100/30 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="mb-7 flex flex-col items-center">
          <BrandLogo size="md" layout="stacked" showTagline={true} />
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-900/5 border border-slate-200/80 text-center">
          {/* Status Badge */}
          <div className="mx-auto mb-5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span>Verification Pending</span>
          </div>

          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Awaiting Admin Approval
          </h2>

          <p className="text-sm text-slate-600 leading-relaxed mb-6">
            Your request to join the carrier has been recorded. A company administrator must review and activate your account using your <strong>Company Code</strong> before you can access dispatch tools.
          </p>

          {/* Instruction Box */}
          <div className="text-left bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-2.5 mb-6 text-xs text-slate-600">
            <div className="flex items-start gap-2.5">
              <Building2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <span>Contact your dispatcher lead or company owner to approve your access.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>Once approved, you will have immediate access to loads, routes, and billing.</span>
            </div>
          </div>

          {statusMessage && (
            <div className="mb-5 flex items-start gap-2 p-3 bg-amber-50/80 border border-amber-200/70 rounded-2xl text-left text-xs text-amber-800">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              <span>{refreshing ? "Checking Status..." : "Check Status / Refresh"}</span>
            </button>

            <button
              type="button"
              onClick={handleSignOut}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4 text-slate-500" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-slate-400">
          Easy Trucking OS • US Domestic Logistics & Freight Management
        </p>
      </div>
    </div>
  );
}
