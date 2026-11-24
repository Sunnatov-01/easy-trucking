"use client";

import { useState } from "react";
import { Copy, Check, Hash } from "lucide-react";

interface CompanyCodeBadgeProps {
  code: string;
}

export function CompanyCodeBadge({ code }: CompanyCodeBadgeProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white border border-blue-200 shadow-sm shadow-blue-500/5">
      <div className="flex items-center gap-1.5 text-xs text-slate-500">
        <Hash className="w-3.5 h-3.5 text-blue-600" />
        <span className="font-semibold text-slate-700">Company Code:</span>
      </div>

      <span className="font-mono text-xs font-extrabold text-blue-700 uppercase tracking-wider bg-blue-50/80 px-2 py-0.5 rounded-lg border border-blue-200/60">
        {code}
      </span>

      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-blue-600 px-1.5 py-0.5 rounded-md hover:bg-blue-50 transition-colors"
        title="Copy Company Code to clipboard"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-700 font-bold">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            <span>Copy</span>
          </>
        )}
      </button>
    </div>
  );
}

export default CompanyCodeBadge;
