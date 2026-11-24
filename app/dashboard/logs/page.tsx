import { History } from "lucide-react";

export default function LogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          System Activity Log
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Audit trail of dispatch updates, load assignments, and status modifications.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-12 border border-slate-200/80 shadow-xs text-center flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mb-4">
          <History className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-1">
          Activity Logs
        </h3>
        <p className="text-xs text-slate-500 max-w-sm">
          Historical log tracking operations across your entire fleet.
        </p>
      </div>
    </div>
  );
}
