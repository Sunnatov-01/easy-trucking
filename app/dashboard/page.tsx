import { auth } from "@/src/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/src/lib/prisma";
import { Suspense } from "react";
import {
  Truck,
  Users,
  DollarSign,
  UserCheck,
  TrendingUp,
  ArrowUpRight,
  Clock,
  ShieldCheck,
  MapPin,
  FileCheck,
  ChevronRight,
  Layers,
  Loader2,
} from "lucide-react";
import { CompanyCodeBadge } from "@/src/components/dashboard/CompanyCodeBadge";

async function DashboardOverviewContent() {
  const session = await auth();

  if (!session?.user) {
    redirect("/register");
  }

  // Fetch real company details and pending users count
  const company = await prisma.company.findUnique({
    where: { id: session.user.companyId },
    select: { name: true, companyCode: true, plan: true },
  });

  const pendingApprovalsCount = await prisma.user.count({
    where: {
      companyId: session.user.companyId,
      status: "PENDING",
    },
  });

  const isOwner = session.user.role === "COMPANY";

  return (
    <div className="space-y-8 select-none">
      {/* 1. Top Welcome & Company Code Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/60 uppercase tracking-wide">
              {company?.name || "Carrier Account"}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">
              Plan: {company?.plan ? company.plan.toUpperCase() : "STANDARD"}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Welcome back, {session.user.name || "Dispatcher"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Fleet operations are running normally. All units GPS synchronized.
          </p>
        </div>

        {/* Company Code Badge for Owners */}
        {isOwner && company?.companyCode && (
          <div className="flex flex-col sm:items-end gap-1.5">
            <span className="text-[11px] font-semibold text-slate-500">
              Invite dispatchers & drivers:
            </span>
            <CompanyCodeBadge code={company.companyCode} />
          </div>
        )}
      </div>

      {/* 2. 4 Minimalist Logistics KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* KPI 1: Active Loads */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:border-blue-300 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Loads
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              24
            </span>
            <span className="inline-flex items-center text-xs font-bold text-emerald-600">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              +12%
            </span>
          </div>
          <p className="text-xs text-slate-500">
            18 In Transit • 6 Dispatched
          </p>
        </div>

        {/* KPI 2: Drivers On Road */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:border-indigo-300 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Drivers On Road
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              18 <span className="text-base text-slate-400 font-medium">/ 22</span>
            </span>
            <span className="text-xs font-semibold text-slate-500">
              82% Active
            </span>
          </div>
          <p className="text-xs text-slate-500">
            4 Available • 0 Out of Service
          </p>
        </div>

        {/* KPI 3: Weekly Gross Revenue */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Weekly Gross Rev
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              $68,450
            </span>
            <span className="inline-flex items-center text-xs font-bold text-emerald-600">
              <ArrowUpRight className="w-3 h-3" />
              $2.74 RPM
            </span>
          </div>
          <p className="text-xs text-slate-500">
            24,980 billable miles this week
          </p>
        </div>

        {/* KPI 4: Pending Approvals (Real Count) */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:border-amber-300 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pending Staff
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {pendingApprovalsCount}
            </span>
            {pendingApprovalsCount > 0 ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                Action required
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                All clear
              </span>
            )}
          </div>
          {isOwner ? (
            <Link
              href="/dashboard/team"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-1 transition-colors"
            >
              <span>Review team requests</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          ) : (
            <p className="text-xs text-slate-500">Awaiting admin review</p>
          )}
        </div>
      </div>

      {/* 3. Two Bottom Cards: Fleet Status Summary & Recent Operations Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-7">
        {/* Fleet Status Summary Card (2 Cols on lg) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Fleet Status Summary
                  </h3>
                  <p className="text-xs text-slate-400">22 Registered Power Units</p>
                </div>
              </div>
            </div>

            {/* Visual Multi-Segment Bar */}
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex mb-6">
              <div
                style={{ width: "62%" }}
                className="bg-blue-600 h-full transition-all"
                title="In Transit: 62%"
              />
              <div
                style={{ width: "18%" }}
                className="bg-indigo-500 h-full transition-all"
                title="At Shipper/Receiver: 18%"
              />
              <div
                style={{ width: "12%" }}
                className="bg-emerald-500 h-full transition-all"
                title="Available for Booking: 12%"
              />
              <div
                style={{ width: "8%" }}
                className="bg-amber-400 h-full transition-all"
                title="Scheduled Maintenance: 8%"
              />
            </div>

            {/* Breakdown List */}
            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  <span className="font-medium text-slate-700">In Transit (Highway)</span>
                </div>
                <span className="font-mono font-bold text-slate-900">14 Trucks (62%)</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <span className="font-medium text-slate-700">At Shipper / Receiver</span>
                </div>
                <span className="font-mono font-bold text-slate-900">4 Trucks (18%)</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="font-medium text-slate-700">Available (Empty & Ready)</span>
                </div>
                <span className="font-mono font-bold text-slate-900">3 Trucks (12%)</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="font-medium text-slate-700">Scheduled PM / Repair</span>
                </div>
                <span className="font-mono font-bold text-slate-900">1 Truck (8%)</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Fleet Safety Index</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
              98.4% Compliant
            </span>
          </div>
        </div>

        {/* Recent Operations Feed Card (3 Cols on lg) */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Recent Operations Feed
                </h3>
                <p className="text-xs text-slate-400">Live dispatch events & load updates</p>
              </div>
            </div>

            <Link
              href="/dashboard/loads"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 transition-colors"
            >
              <span>View Update List</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Timeline list */}
          <div className="space-y-4">
            {/* Event 1 */}
            <div className="flex items-start gap-3.5 pb-3.5 border-b border-slate-100">
              <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900 truncate">
                    Load #ET-8492 Loaded & En Route
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono flex-shrink-0">
                    12m ago
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Picked up in <strong className="text-slate-700">Dallas, TX</strong>. ETA to Chicago, IL tomorrow 08:00 CST. Driver: Marcus Vance.
                </p>
              </div>
            </div>

            {/* Event 2 */}
            <div className="flex items-start gap-3.5 pb-3.5 border-b border-slate-100">
              <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <FileCheck className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900 truncate">
                    Signed Proof of Delivery Uploaded
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono flex-shrink-0">
                    38m ago
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Load #ET-8488 delivered in <strong className="text-slate-700">Atlanta, GA</strong>. Clean BOL uploaded and queued for factoring.
                </p>
              </div>
            </div>

            {/* Event 3 */}
            <div className="flex items-start gap-3.5 pb-3.5 border-b border-slate-100">
              <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <DollarSign className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900 truncate">
                    Rate Con Confirmed • C.H. Robinson
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono flex-shrink-0">
                    1h 15m ago
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Load #ET-8501: Columbus, OH to Orlando, FL booked at <strong className="text-slate-700">$3,850 ($3.18 RPM)</strong>.
                </p>
              </div>
            </div>

            {/* Event 4 */}
            <div className="flex items-start gap-3.5 pb-3.5 border-b border-slate-100">
              <div className="w-7 h-7 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Truck className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900 truncate">
                    Driver Check Call Received
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono flex-shrink-0">
                    2h 04m ago
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Elena Rostova (Truck #108) checked in on I-80 Rest Area Mile 142. All gauges green, on schedule.
                </p>
              </div>
            </div>

            {/* Event 5 */}
            <div className="flex items-start gap-3.5">
              <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900 truncate">
                    Annual DOT Inspection Scheduled
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono flex-shrink-0">
                    3h 30m ago
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Unit #104 scheduled for preventive maintenance & brake inspection at Gary, IN terminal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardOverviewSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-28 bg-white rounded-3xl border border-slate-200/80 p-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 bg-white rounded-3xl border border-slate-200/80 p-6"
          />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 h-72 bg-white rounded-3xl border border-slate-200/80" />
        <div className="lg:col-span-3 h-72 bg-white rounded-3xl border border-slate-200/80" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardOverviewSkeleton />}>
      <DashboardOverviewContent />
    </Suspense>
  );
}
