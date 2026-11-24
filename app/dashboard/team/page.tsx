import { auth } from "@/src/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/src/lib/prisma";
import { Suspense } from "react";
import { Clock, Loader2 } from "lucide-react";

async function TeamContent() {
  const session = await auth();

  if (!session?.user) {
    redirect("/register");
  }

  // Only COMPANY admin can access team approvals
  if (session.user.role !== "COMPANY") {
    redirect("/dashboard");
  }

  const pendingUsers = await prisma.user.findMany({
    where: {
      companyId: session.user.companyId,
      status: "PENDING",
    },
    select: {
      id: true,
      name: true,
      email: true,
      department: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Team Approvals & Members
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Review staff join requests submitted with your Company Code.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
          <Clock className="w-4 h-4 text-amber-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Pending Staff Verification ({pendingUsers.length})
          </h3>
        </div>

        {pendingUsers.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No pending employee requests at this time. All team members are verified.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pendingUsers.map((u) => (
              <div key={u.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">{u.name}</div>
                  <div className="text-[11px] text-slate-500">{u.email}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {u.department}
                  </span>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                    Pending
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TeamPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      }
    >
      <TeamContent />
    </Suspense>
  );
}
