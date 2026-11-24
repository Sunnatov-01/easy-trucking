import { Users } from "lucide-react";

export default function DriversPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Driver Fleet Directory
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Assigned power units, truck numbers, and driver commission percentages.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-12 border border-slate-200/80 shadow-xs text-center flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
          <Users className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-1">
          Driver Management
        </h3>
        <p className="text-xs text-slate-500 max-w-sm">
          Directory of company drivers, assigned dispatchers, and equipment profiles.
        </p>
      </div>
    </div>
  );
}
