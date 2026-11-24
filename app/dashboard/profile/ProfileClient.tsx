"use client";

import React, { useState, useTransition } from "react";
import {
  Building2,
  Mail,
  Shield,
  KeyRound,
  Copy,
  Check,
  Eye,
  EyeOff,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Headphones,
  User as UserIcon,
  Sparkles,
} from "lucide-react";
import {
  updateProfileName,
  updateCompanyName,
  changePassword,
} from "./actions";

interface ProfileClientProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    department: string | null;
    status: string;
    createdAt: Date;
    company: {
      id: string;
      name: string;
      companyCode: string;
      plan: string;
      subscriptionStatus: string;
    };
  };
}

export function ProfileClient({ user }: ProfileClientProps) {
  // Personal Info Form State
  const [name, setName] = useState(user.name);
  const [profileMsg, setProfileMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isProfilePending, startProfileTransition] = useTransition();

  // Company Form State
  const [companyName, setCompanyName] = useState(user.company.name);
  const [companyMsg, setCompanyMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isCompanyPending, startCompanyTransition] = useTransition();
  const [copiedCode, setCopiedCode] = useState(false);

  // Security / Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isPasswordPending, startPasswordTransition] = useTransition();

  // Avatar Initials
  const initials = (name || user.company.name || "ET")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("") || "ET";

  // Role Badge Styling
  function getRoleInfo() {
    if (user.role === "COMPANY") {
      return {
        label: "Carrier Owner",
        icon: Building2,
        badgeClass: "bg-blue-50 text-blue-700 border-blue-200/80",
      };
    }
    if (user.department) {
      return {
        label: user.department,
        icon: Headphones,
        badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200/80",
      };
    }
    return {
      label: "Staff",
      icon: UserIcon,
      badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
    };
  }

  const roleInfo = getRoleInfo();
  const RoleIcon = roleInfo.icon;

  // Handlers
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(user.company.companyCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      // ignore clipboard error
    }
  };

  const handleProfileSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProfileMsg(null);
    const formData = new FormData();
    formData.append("name", name);

    startProfileTransition(async () => {
      const res = await updateProfileName(formData);
      if (res.success) {
        setProfileMsg({ type: "success", text: res.message || "Updated successfully" });
      } else {
        setProfileMsg({ type: "error", text: res.error || "Update failed" });
      }
    });
  };

  const handleCompanySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCompanyMsg(null);
    const formData = new FormData();
    formData.append("companyName", companyName);

    startCompanyTransition(async () => {
      const res = await updateCompanyName(formData);
      if (res.success) {
        setCompanyMsg({ type: "success", text: res.message || "Updated successfully" });
      } else {
        setCompanyMsg({ type: "error", text: res.error || "Update failed" });
      }
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword.length < 8) {
      setPasswordMsg({
        type: "error",
        text: "New password must be at least 8 characters long.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg({
        type: "error",
        text: "New passwords do not match.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("currentPassword", currentPassword);
    formData.append("newPassword", newPassword);
    formData.append("confirmPassword", confirmPassword);

    startPasswordTransition(async () => {
      const res = await changePassword(formData);
      if (res.success) {
        setPasswordMsg({ type: "success", text: res.message || "Password changed" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordMsg({ type: "error", text: res.error || "Password change failed" });
      }
    });
  };

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      {/* Page Title Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Account Profile & Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your personal credentials, company association, and account security.
        </p>
      </div>

      {/* 1. Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {/* Large Initial Avatar */}
          <div className="w-18 h-18 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-blue-600/20 flex-shrink-0 select-none">
            {initials}
          </div>

          {/* Details */}
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {name}
              </h2>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border text-xs font-semibold ${roleInfo.badgeClass}`}
              >
                <RoleIcon className="w-3.5 h-3.5" />
                <span>{roleInfo.label}</span>
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{user.email}</span>
            </p>

            <div className="mt-3 flex items-center gap-2 flex-wrap text-xs text-slate-600">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200/70 font-medium">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{user.company.name}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Active Account</span>
              </span>
            </div>
          </div>
        </div>

        {/* Member Since info */}
        <div className="text-left sm:text-right text-xs text-slate-400 border-t sm:border-t-0 pt-4 sm:pt-0 w-full sm:w-auto">
          <p className="font-medium text-slate-500">Carrier Member</p>
          <p className="font-mono text-[11px] mt-0.5">
            Since{" "}
            {new Date(user.createdAt).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* 2. Personal Information Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Personal Information
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Update your display name and review account credentials.
            </p>
          </div>
          <Sparkles className="w-5 h-5 text-blue-500 opacity-60" />
        </div>

        {profileMsg && (
          <div
            className={`mt-4 p-3.5 rounded-2xl border text-xs font-medium flex items-center gap-2.5 ${
              profileMsg.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200/80"
                : "bg-red-50 text-red-800 border-red-200/80"
            }`}
          >
            {profileMsg.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            )}
            <span>{profileMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleProfileSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label
                htmlFor="profile-name"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Full Name
              </label>
              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                placeholder="Enter your name"
              />
            </div>

            {/* Email (Read-Only) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="profile-email"
                  className="block text-xs font-semibold text-slate-700"
                >
                  Email Address
                </label>
                <span className="text-[10px] text-slate-400 font-medium">
                  Read-only
                </span>
              </div>
              <input
                id="profile-email"
                type="email"
                value={user.email}
                disabled
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-500 bg-slate-50/80 cursor-not-allowed select-none"
              />
            </div>

            {/* Role & Department (Read-Only) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Account Role & Access
              </label>
              <div className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 bg-slate-50/80 flex items-center justify-between">
                <span>{roleInfo.label}</span>
                <span className="text-[11px] font-mono font-semibold text-slate-400">
                  {user.role}
                </span>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Account Status
              </label>
              <div className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 bg-slate-50/80 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>{user.status}</span>
                </span>
                <span className="text-[11px] text-emerald-600 font-semibold">
                  Verified
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isProfilePending || name === user.name}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-600/25 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isProfilePending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. Company Details Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Company Association
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {user.role === "COMPANY"
                ? "Manage your registered carrier name and share your company code."
                : "Your account is linked to this registered carrier organization."}
            </p>
          </div>
          <Building2 className="w-5 h-5 text-indigo-500 opacity-60" />
        </div>

        {companyMsg && (
          <div
            className={`mt-4 p-3.5 rounded-2xl border text-xs font-medium flex items-center gap-2.5 ${
              companyMsg.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200/80"
                : "bg-red-50 text-red-800 border-red-200/80"
            }`}
          >
            {companyMsg.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            )}
            <span>{companyMsg.text}</span>
          </div>
        )}

        {user.role === "COMPANY" ? (
          <form onSubmit={handleCompanySubmit} className="mt-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Editable Company Name */}
              <div>
                <label
                  htmlFor="company-name"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Carrier / Company Name
                </label>
                <input
                  id="company-name"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  minLength={2}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                  placeholder="Carrier Company Name"
                />
              </div>

              {/* Copyable Company Code */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Unique Company Code (For Driver / Staff Invite)
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-3.5 py-2.5 rounded-xl border border-blue-200/70 bg-blue-50/50 text-sm font-mono font-bold text-blue-700 select-all">
                    {user.company.companyCode}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 text-xs font-semibold shadow-2xs transition-all flex-shrink-0"
                    title="Copy Company Code"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-slate-500" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={
                  isCompanyPending || companyName === user.company.name
                }
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-600/25 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isCompanyPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>Save Company</span>
              </button>
            </div>
          </form>
        ) : (
          /* Employee Read-Only Company Card */
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Connected Carrier
              </label>
              <div className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 bg-slate-50/80">
                {user.company.name}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Company Registration Code
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono font-bold text-slate-700 bg-slate-50/80 select-all">
                  {user.company.companyCode}
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 transition-all"
                  title="Copy Code"
                >
                  {copiedCode ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-slate-500" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Security / Change Password Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Security & Password
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Change your login password to keep your dispatch account secure.
            </p>
          </div>
          <KeyRound className="w-5 h-5 text-amber-500 opacity-60" />
        </div>

        {passwordMsg && (
          <div
            className={`mt-4 p-3.5 rounded-2xl border text-xs font-medium flex items-center gap-2.5 ${
              passwordMsg.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200/80"
                : "bg-red-50 text-red-800 border-red-200/80"
            }`}
          >
            {passwordMsg.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            )}
            <span>{passwordMsg.text}</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Current Password */}
            <div>
              <label
                htmlFor="current-pw"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Current Password
              </label>
              <div className="relative">
                <input
                  id="current-pw"
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showCurrent ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label
                htmlFor="new-pw"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                New Password (min 8 chars)
              </label>
              <div className="relative">
                <input
                  id="new-pw"
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showNew ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label
                htmlFor="confirm-pw"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirm-pw"
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={
                isPasswordPending ||
                !currentPassword ||
                !newPassword ||
                !confirmPassword
              }
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-600/25 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isPasswordPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Shield className="w-4 h-4" />
              )}
              <span>Update Password</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileClient;
