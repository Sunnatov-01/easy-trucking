"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { BrandLogo } from "@/src/components/BrandLogo";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const prefillEmail = searchParams.get("email") || "";

  const [form, setForm] = useState({
    email: prefillEmail,
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        setLoading(false);
        setError("Invalid email address or password.");
        return;
      }

      // Check user session status
      const res = await fetch("/api/auth/session");
      const session = await res.json();
      setLoading(false);

      if (session?.user?.status === "PENDING") {
        router.push("/pending");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setLoading(false);
      setError("An unexpected error occurred. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8 selection:bg-blue-100 selection:text-blue-900">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[760px] h-[450px] bg-gradient-to-b from-blue-100/50 via-indigo-50/30 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="w-full max-w-sm">
        {/* Brand Header */}
        <div className="mb-7 flex flex-col items-center">
          <BrandLogo size="md" layout="stacked" showTagline={true} />
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-900/5 border border-slate-200/80">
          <div className="mb-6">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 text-center">
              Sign In to Your Workspace
            </h2>
            <p className="mt-1 text-xs text-slate-500 text-center">
              Access your loads, dispatch board, and fleet assets
            </p>
          </div>

          {registered && (
            <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-600" />
              <span className="leading-relaxed">
                Registration successful! Sign in with your owner credentials.
              </span>
            </div>
          )}

          {error && (
            <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="name@company.com"
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
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Navigation */}
        <p className="mt-8 text-center text-sm text-slate-500">
          New to Easy Trucking?{" "}
          <Link
            href="/register"
            className="font-semibold text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center gap-1"
          >
            <span>Create an account</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50/70 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
