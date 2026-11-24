"use client";

import React, { useState, useTransition, useMemo } from "react";
import type { Load, LoadStatus } from "@prisma/client";
import {
  Truck,
  TrendingUp,
  MapPin,
  Clock,
  Search,
  Plus,
  Database,
  Copy,
  Check,
  ChevronRight,
  ArrowRight,
  MoreVertical,
  Pencil,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  Phone,
  DollarSign,
  Layers,
  Sparkles,
} from "lucide-react";
import {
  createLoadAction,
  updateLoadAction,
  updateLoadStatusAction,
  updateLoadInlineAction,
  deleteLoadAction,
  seedSampleLoadsAction,
} from "./actions";

interface LoadsTableClientProps {
  initialLoads: Load[];
  companyId: string;
  userRole?: string;
}

const STATUS_CONFIG: Record<
  LoadStatus,
  {
    label: string;
    badgeClass: string;
    dotClass: string;
  }
> = {
  DISPATCHED: {
    label: "Dispatched",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200/80",
    dotClass: "bg-blue-500",
  },
  AT_PICKUP: {
    label: "At Pickup",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200/80",
    dotClass: "bg-amber-500",
  },
  IN_TRANSIT: {
    label: "In Transit",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    dotClass: "bg-emerald-500 animate-pulse",
  },
  AT_DELIVERY: {
    label: "At Delivery",
    badgeClass: "bg-sky-50 text-sky-700 border-sky-200/80",
    dotClass: "bg-sky-500",
  },
  DELIVERED: {
    label: "Delivered",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
    dotClass: "bg-slate-400",
  },
  HOLD: {
    label: "Hold",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200/80",
    dotClass: "bg-rose-500",
  },
};

const ALL_STATUSES: LoadStatus[] = [
  "DISPATCHED",
  "AT_PICKUP",
  "IN_TRANSIT",
  "AT_DELIVERY",
  "DELIVERED",
  "HOLD",
];

// Helper to extract numeric dollars from strings like "$3,450 / 12%"
function parseGrossAmount(ratePercent: string): number {
  if (!ratePercent) return 0;
  const match = ratePercent.match(/\$?\s*([\d,]+(?:\.\d+)?)/);
  if (match && match[1]) {
    const num = parseFloat(match[1].replace(/,/g, ""));
    return isNaN(num) ? 0 : num;
  }
  return 0;
}

export function LoadsTableClient({
  initialLoads,
  companyId,
}: LoadsTableClientProps) {
  const [loads, setLoads] = useState<Load[]>(initialLoads);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<
    "ALL" | LoadStatus
  >("ALL");

  // Phone copy state
  const [copiedPhoneId, setCopiedPhoneId] = useState<string | null>(null);

  // Inline editing state: { loadId, field, value }
  const [editingCell, setEditingCell] = useState<{
    loadId: string;
    field: "currentLocation" | "eta" | "notes";
    value: string;
  } | null>(null);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLoad, setEditingLoad] = useState<Load | null>(null);
  const [deletingLoad, setDeletingLoad] = useState<Load | null>(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    loadNumber: "",
    unitNumber: "",
    plate: "",
    driverName: "",
    phoneNumber: "",
    route: "",
    miles: "0",
    currentLocation: "",
    eta: "",
    status: "DISPATCHED" as LoadStatus,
    brokerCompany: "",
    ratePercent: "",
    reserve: "$0",
    notes: "",
  });

  // Action transitions
  const [isSeeding, startSeedTransition] = useTransition();
  const [isSubmitting, startSubmitTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  // Synchronize when initialLoads changes from SSR revalidation
  React.useEffect(() => {
    setLoads(initialLoads);
  }, [initialLoads]);

  // KPI Calculations
  const kpiData = useMemo(() => {
    const totalLoads = loads.length;
    const inTransit = loads.filter((l) => l.status === "IN_TRANSIT").length;
    const totalMiles = loads.reduce((acc, l) => acc + (l.miles || 0), 0);
    const totalGross = loads.reduce(
      (acc, l) => acc + parseGrossAmount(l.ratePercent),
      0
    );

    return {
      totalLoads,
      inTransit,
      totalMiles,
      totalGross,
    };
  }, [loads]);

  // Filtered Loads
  const filteredLoads = useMemo(() => {
    return loads.filter((load) => {
      // Status filter
      if (
        selectedStatusFilter !== "ALL" &&
        load.status !== selectedStatusFilter
      ) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesLoadId = load.loadNumber.toLowerCase().includes(q);
        const matchesUnit = load.unitNumber.toLowerCase().includes(q);
        const matchesPlate = load.plate.toLowerCase().includes(q);
        const matchesDriver = load.driverName.toLowerCase().includes(q);
        const matchesRoute = load.route.toLowerCase().includes(q);
        const matchesBroker = load.brokerCompany.toLowerCase().includes(q);

        return (
          matchesLoadId ||
          matchesUnit ||
          matchesPlate ||
          matchesDriver ||
          matchesRoute ||
          matchesBroker
        );
      }

      return true;
    });
  }, [loads, selectedStatusFilter, searchQuery]);

  // Handlers
  const handleCopyPhone = async (loadId: string, phone: string) => {
    try {
      await navigator.clipboard.writeText(phone);
      setCopiedPhoneId(loadId);
      setTimeout(() => setCopiedPhoneId(null), 2000);
    } catch {
      // ignore clipboard error
    }
  };

  const handleStatusChange = async (loadId: string, newStatus: LoadStatus) => {
    // Optimistic local update
    setLoads((prev) =>
      prev.map((l) => (l.id === loadId ? { ...l, status: newStatus } : l))
    );

    const res = await updateLoadStatusAction(loadId, newStatus);
    if (!res.success) {
      // Revert if error
      setLoads(initialLoads);
      alert(res.error || "Failed to update status");
    }
  };

  const handleInlineSave = async () => {
    if (!editingCell) return;
    const { loadId, field, value } = editingCell;
    const trimmed = value.trim();

    // Optimistic update
    setLoads((prev) =>
      prev.map((l) => (l.id === loadId ? { ...l, [field]: trimmed } : l))
    );
    setEditingCell(null);

    const res = await updateLoadInlineAction(loadId, field, trimmed);
    if (!res.success) {
      setLoads(initialLoads);
      alert(res.error || "Failed to save inline edit");
    }
  };

  const handleSeedLoads = () => {
    startSeedTransition(async () => {
      const res = await seedSampleLoadsAction();
      if (!res.success) {
        alert(res.error || "Failed to seed sample loads");
      }
    });
  };

  const handleOpenAddModal = () => {
    setFormData({
      loadNumber: `LD-${Math.floor(1000 + Math.random() * 9000)}`,
      unitNumber: "TRK-",
      plate: "",
      driverName: "",
      phoneNumber: "",
      route: "",
      miles: "0",
      currentLocation: "",
      eta: "",
      status: "DISPATCHED",
      brokerCompany: "",
      ratePercent: "",
      reserve: "$0",
      notes: "",
    });
    setFormError(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (load: Load) => {
    setEditingLoad(load);
    setFormData({
      loadNumber: load.loadNumber,
      unitNumber: load.unitNumber,
      plate: load.plate,
      driverName: load.driverName,
      phoneNumber: load.phoneNumber,
      route: load.route,
      miles: String(load.miles),
      currentLocation: load.currentLocation,
      eta: load.eta,
      status: load.status,
      brokerCompany: load.brokerCompany,
      ratePercent: load.ratePercent,
      reserve: load.reserve,
      notes: load.notes,
    });
    setFormError(null);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => data.append(k, String(v)));

    startSubmitTransition(async () => {
      if (editingLoad) {
        const res = await updateLoadAction(editingLoad.id, data);
        if (res.success && res.load) {
          setLoads((prev) =>
            prev.map((l) => (l.id === editingLoad.id ? res.load! : l))
          );
          setEditingLoad(null);
        } else {
          setFormError(res.error || "Failed to update load");
        }
      } else {
        const res = await createLoadAction(data);
        if (res.success && res.load) {
          setLoads((prev) => [res.load!, ...prev]);
          setIsAddModalOpen(false);
        } else {
          setFormError(res.error || "Failed to create load");
        }
      }
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deletingLoad) return;
    const idToDelete = deletingLoad.id;

    // Optimistic removal
    setLoads((prev) => prev.filter((l) => l.id !== idToDelete));
    setDeletingLoad(null);

    const res = await deleteLoadAction(idToDelete);
    if (!res.success) {
      setLoads(initialLoads);
      alert(res.error || "Failed to delete load");
    }
  };

  return (
    <div className="space-y-6 select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>Update List & Dispatch Board</span>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded-full">
              Live Fleet Feed
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time broker check calls, driver status updates, ETAs, and dispatch operations.
          </p>
        </div>

        {/* Action Header Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleSeedLoads}
            disabled={isSeeding}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200/90 hover:border-slate-300 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 shadow-2xs transition-all disabled:opacity-50"
            title="Insert 8 sample US freight loads for testing"
          >
            {isSeeding ? (
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            ) : (
              <Database className="w-4 h-4 text-blue-600" />
            )}
            <span>Seed Sample Loads</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-600/25 active:scale-[0.98] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add New Load</span>
          </button>
        </div>
      </div>

      {/* 1. Compact 4-Card KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* KPI 1: Total Loads */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Loads
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {kpiData.totalLoads}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Active carrier manifest</p>
        </div>

        {/* KPI 2: In Transit */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              In Transit
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 tracking-tight flex items-center gap-2">
            <span>{kpiData.inTransit}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Rolling on highway</p>
        </div>

        {/* KPI 3: Total Miles */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Miles
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {kpiData.totalMiles.toLocaleString()}
            <span className="text-sm font-semibold text-slate-400 ml-1">mi</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Scheduled freight distance</p>
        </div>

        {/* KPI 4: Total Gross */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Gross ($)
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-700 tracking-tight">
            ${kpiData.totalGross.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Gross freight contract value</p>
        </div>
      </div>

      {/* 2. Action Toolbar: Search + Filter Pills */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Load ID, Unit, Driver, Route, Broker..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50 hover:bg-white"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedStatusFilter("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              selectedStatusFilter === "ALL"
                ? "bg-slate-900 text-white shadow-xs font-bold"
                : "text-slate-600 hover:bg-slate-100 bg-slate-50"
            }`}
          >
            All ({loads.length})
          </button>

          {ALL_STATUSES.map((status) => {
            const count = loads.filter((l) => l.status === status).length;
            const config = STATUS_CONFIG[status];
            const isSelected = selectedStatusFilter === status;

            return (
              <button
                key={status}
                type="button"
                onClick={() => setSelectedStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? `${config.badgeClass} ring-2 ring-blue-500/30 font-bold`
                    : "text-slate-600 hover:bg-slate-100 bg-slate-50"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
                <span>{config.label}</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. 14-Column High-Density Dispatch Table with Sticky First Column */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto max-h-[640px] relative scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          <table className="w-full border-collapse text-left text-xs whitespace-nowrap">
            {/* Table Header */}
            <thead className="bg-slate-50/90 backdrop-blur-xs sticky top-0 z-30 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider select-none">
              <tr>
                {/* 1. Sticky Load ID + Unit # */}
                <th className="sticky left-0 z-40 bg-slate-100/95 backdrop-blur-xs px-4 py-3.5 text-left border-r border-slate-200/90 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] min-w-[130px]">
                  Load ID / Unit
                </th>
                {/* 2. Plate */}
                <th className="px-3.5 py-3.5 min-w-[100px]">Plate</th>
                {/* 3. Driver Name */}
                <th className="px-3.5 py-3.5 min-w-[140px]">Driver Name</th>
                {/* 4. Phone Number */}
                <th className="px-3.5 py-3.5 min-w-[130px]">Phone Number</th>
                {/* 5. Route */}
                <th className="px-4 py-3.5 min-w-[210px]">Route</th>
                {/* 6. Miles */}
                <th className="px-3.5 py-3.5 text-right min-w-[85px]">Miles</th>
                {/* 7. Current Location */}
                <th className="px-3.5 py-3.5 min-w-[180px]">Current Location (Edit)</th>
                {/* 8. ETA */}
                <th className="px-3.5 py-3.5 min-w-[160px]">ETA (Edit)</th>
                {/* 9. Status */}
                <th className="px-3.5 py-3.5 min-w-[140px]">Status</th>
                {/* 10. Broker / Company */}
                <th className="px-3.5 py-3.5 min-w-[150px]">Broker / Company</th>
                {/* 11. Rate / % */}
                <th className="px-3.5 py-3.5 min-w-[120px]">Rate / %</th>
                {/* 12. Reserve */}
                <th className="px-3.5 py-3.5 min-w-[90px]">Reserve</th>
                {/* 13. Notes */}
                <th className="px-4 py-3.5 min-w-[220px]">Notes (Edit)</th>
                {/* 14. Row Actions */}
                <th className="px-3.5 py-3.5 text-center min-w-[80px]">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLoads.length === 0 ? (
                <tr>
                  <td
                    colSpan={14}
                    className="py-16 text-center text-slate-400 bg-white"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Truck className="w-8 h-8 text-slate-300 stroke-[1.5]" />
                      <p className="text-sm font-semibold text-slate-600">
                        No dispatch loads match your query
                      </p>
                      <p className="text-xs text-slate-400 max-w-xs">
                        Try clearing your search filters or click "Seed Sample Loads" to load test data.
                      </p>
                      {loads.length === 0 && (
                        <button
                          type="button"
                          onClick={handleSeedLoads}
                          disabled={isSeeding}
                          className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
                        >
                          <Database className="w-3.5 h-3.5" />
                          <span>Seed Sample Loads</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLoads.map((load) => {
                  const statusConf = STATUS_CONFIG[load.status];

                  return (
                    <tr
                      key={load.id}
                      className="group hover:bg-slate-50/70 transition-colors"
                    >
                      {/* 1. Sticky Load ID + Unit # */}
                      <td className="sticky left-0 z-20 bg-white group-hover:bg-slate-50/90 px-4 py-3 border-r border-slate-200/80 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-mono font-bold text-xs text-blue-700 bg-blue-50/90 border border-blue-200/70 px-2 py-0.5 rounded-md w-fit">
                            #{load.loadNumber}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-800">
                            {load.unitNumber}
                          </span>
                        </div>
                      </td>

                      {/* 2. Plate */}
                      <td className="px-3.5 py-3 font-mono text-xs text-slate-600">
                        <span className="bg-slate-50 border border-slate-200/70 px-1.5 py-0.5 rounded">
                          {load.plate || "—"}
                        </span>
                      </td>

                      {/* 3. Driver Name */}
                      <td className="px-3.5 py-3 font-semibold text-slate-900">
                        {load.driverName}
                      </td>

                      {/* 4. Phone Number (One-Click Copy) */}
                      <td className="px-3.5 py-3">
                        <div className="flex items-center gap-1.5 font-mono text-[11px]">
                          <span>{load.phoneNumber || "—"}</span>
                          {load.phoneNumber && (
                            <button
                              type="button"
                              onClick={() =>
                                handleCopyPhone(load.id, load.phoneNumber)
                              }
                              className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                              title="Copy Phone Number"
                            >
                              {copiedPhoneId === load.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>

                      {/* 5. Route (formatted with arrow) */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-800">
                          {load.route.includes("->") ? (
                            <>
                              <span className="text-slate-900 font-semibold">
                                {load.route.split("->")[0].trim()}
                              </span>
                              <ArrowRight className="w-3 h-3 text-slate-400 flex-shrink-0" />
                              <span className="text-slate-900 font-semibold">
                                {load.route.split("->")[1].trim()}
                              </span>
                            </>
                          ) : (
                            <span>{load.route}</span>
                          )}
                        </div>
                      </td>

                      {/* 6. Miles */}
                      <td className="px-3.5 py-3 text-right font-mono font-semibold text-slate-700">
                        {load.miles ? `${load.miles.toLocaleString()} mi` : "0 mi"}
                      </td>

                      {/* 7. Current Location (Click-to-Edit) */}
                      <td className="px-3.5 py-3">
                        {editingCell?.loadId === load.id &&
                        editingCell.field === "currentLocation" ? (
                          <input
                            type="text"
                            autoFocus
                            value={editingCell.value}
                            onChange={(e) =>
                              setEditingCell({
                                ...editingCell,
                                value: e.target.value,
                              })
                            }
                            onBlur={handleInlineSave}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleInlineSave();
                              if (e.key === "Escape") setEditingCell(null);
                            }}
                            className="w-full px-2 py-1 text-xs border border-blue-400 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                          />
                        ) : (
                          <div
                            onClick={() =>
                              setEditingCell({
                                loadId: load.id,
                                field: "currentLocation",
                                value: load.currentLocation,
                              })
                            }
                            className="cursor-pointer hover:bg-blue-50/50 hover:text-blue-900 px-2 py-1 rounded transition-colors truncate max-w-[180px]"
                            title="Click to edit location"
                          >
                            <span className="font-medium">
                              {load.currentLocation || "Click to add location"}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* 8. ETA (Click-to-Edit) */}
                      <td className="px-3.5 py-3">
                        {editingCell?.loadId === load.id &&
                        editingCell.field === "eta" ? (
                          <input
                            type="text"
                            autoFocus
                            value={editingCell.value}
                            onChange={(e) =>
                              setEditingCell({
                                ...editingCell,
                                value: e.target.value,
                              })
                            }
                            onBlur={handleInlineSave}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleInlineSave();
                              if (e.key === "Escape") setEditingCell(null);
                            }}
                            className="w-full px-2 py-1 text-xs border border-blue-400 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                          />
                        ) : (
                          <div
                            onClick={() =>
                              setEditingCell({
                                loadId: load.id,
                                field: "eta",
                                value: load.eta,
                              })
                            }
                            className="cursor-pointer hover:bg-blue-50/50 hover:text-blue-900 px-2 py-1 rounded transition-colors truncate max-w-[160px]"
                            title="Click to edit ETA"
                          >
                            <span className="font-medium text-slate-800">
                              {load.eta || "Click to add ETA"}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* 9. Status (Custom Styled Colored Dropdown Pill) */}
                      <td className="px-3.5 py-3">
                        <div className="relative inline-block">
                          <select
                            value={load.status}
                            onChange={(e) =>
                              handleStatusChange(
                                load.id,
                                e.target.value as LoadStatus
                              )
                            }
                            className={`appearance-none cursor-pointer pl-2.5 pr-6 py-1 rounded-lg text-[11px] font-bold border transition-all ${statusConf.badgeClass} focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                          >
                            {ALL_STATUSES.map((st) => (
                              <option key={st} value={st} className="text-slate-900 font-semibold bg-white">
                                {STATUS_CONFIG[st].label}
                              </option>
                            ))}
                          </select>
                          <ChevronRight className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
                        </div>
                      </td>

                      {/* 10. Broker / Company */}
                      <td className="px-3.5 py-3 font-medium text-slate-800 max-w-[150px] truncate" title={load.brokerCompany}>
                        {load.brokerCompany}
                      </td>

                      {/* 11. Rate / % */}
                      <td className="px-3.5 py-3">
                        <span className="font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                          {load.ratePercent || "$0 / 0%"}
                        </span>
                      </td>

                      {/* 12. Reserve */}
                      <td className="px-3.5 py-3 font-mono text-slate-600">
                        {load.reserve || "$0"}
                      </td>

                      {/* 13. Notes (Click-to-Edit) */}
                      <td className="px-4 py-3">
                        {editingCell?.loadId === load.id &&
                        editingCell.field === "notes" ? (
                          <input
                            type="text"
                            autoFocus
                            value={editingCell.value}
                            onChange={(e) =>
                              setEditingCell({
                                ...editingCell,
                                value: e.target.value,
                              })
                            }
                            onBlur={handleInlineSave}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleInlineSave();
                              if (e.key === "Escape") setEditingCell(null);
                            }}
                            className="w-full px-2 py-1 text-xs border border-blue-400 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                          />
                        ) : (
                          <div
                            onClick={() =>
                              setEditingCell({
                                loadId: load.id,
                                field: "notes",
                                value: load.notes,
                              })
                            }
                            className="cursor-pointer hover:bg-blue-50/50 hover:text-blue-900 px-2 py-1 rounded transition-colors text-slate-500 max-w-[220px] truncate"
                            title="Click to edit notes"
                          >
                            <span>{load.notes || "—"}</span>
                          </div>
                        )}
                      </td>

                      {/* 14. Row Actions */}
                      <td className="px-3.5 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(load)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Edit Full Load"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingLoad(load)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete Load"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Apple-Style Modal: Add / Edit Load (All 14 Fields) */}
      {(isAddModalOpen || editingLoad) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200/90 relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  {editingLoad ? `Edit Load #${editingLoad.loadNumber}` : "Create New Dispatch Load"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter complete freight specifications, driver assignment, and rate information.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingLoad(null);
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 1. Load ID */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Load ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.loadNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, loadNumber: e.target.value })
                    }
                    placeholder="LD-4821"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {/* 2. Unit # */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Unit # *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.unitNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, unitNumber: e.target.value })
                    }
                    placeholder="TRK-104"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {/* 3. Plate */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Plate
                  </label>
                  <input
                    type="text"
                    value={formData.plate}
                    onChange={(e) =>
                      setFormData({ ...formData, plate: e.target.value })
                    }
                    placeholder="IL-94821"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 4. Driver Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Driver Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.driverName}
                    onChange={(e) =>
                      setFormData({ ...formData, driverName: e.target.value })
                    }
                    placeholder="Marcus Vance"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {/* 5. Phone Number */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                    placeholder="(312) 555-0144"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 6. Route */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Route (Origin -&gt; Destination) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.route}
                    onChange={(e) =>
                      setFormData({ ...formData, route: e.target.value })
                    }
                    placeholder="Chicago, IL -> Dallas, TX"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {/* 7. Miles */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Miles
                  </label>
                  <input
                    type="number"
                    value={formData.miles}
                    onChange={(e) =>
                      setFormData({ ...formData, miles: e.target.value })
                    }
                    placeholder="924"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 8. Current Location */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Current Location
                  </label>
                  <input
                    type="text"
                    value={formData.currentLocation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        currentLocation: e.target.value,
                      })
                    }
                    placeholder="St. Louis, MO (I-55 S)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {/* 9. ETA */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ETA
                  </label>
                  <input
                    type="text"
                    value={formData.eta}
                    onChange={(e) =>
                      setFormData({ ...formData, eta: e.target.value })
                    }
                    placeholder="Tomorrow 08:30 AM"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {/* 10. Status */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as LoadStatus,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    {ALL_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {STATUS_CONFIG[st].label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 11. Broker Company */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Broker / Company
                  </label>
                  <input
                    type="text"
                    value={formData.brokerCompany}
                    onChange={(e) =>
                      setFormData({ ...formData, brokerCompany: e.target.value })
                    }
                    placeholder="C.H. Robinson"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {/* 12. Rate / % */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Rate / %
                  </label>
                  <input
                    type="text"
                    value={formData.ratePercent}
                    onChange={(e) =>
                      setFormData({ ...formData, ratePercent: e.target.value })
                    }
                    placeholder="$3,450 / 12%"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {/* 13. Reserve */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Reserve
                  </label>
                  <input
                    type="text"
                    value={formData.reserve}
                    onChange={(e) =>
                      setFormData({ ...formData, reserve: e.target.value })
                    }
                    placeholder="$350"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* 14. Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notes
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Driver instructions, shipper contacts, reefer temperature..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingLoad(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingLoad ? "Save Changes" : "Create Load"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Delete Confirmation Modal */}
      {deletingLoad && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200/90 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Delete Load #{deletingLoad.loadNumber}?
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              This will permanently remove load #{deletingLoad.loadNumber} (Driver: {deletingLoad.driverName}) from the company manifest.
            </p>

            <div className="mt-5 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setDeletingLoad(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-sm transition-all"
              >
                Delete Load
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoadsTableClient;
