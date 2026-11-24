import { Suspense } from "react";
import { auth } from "@/src/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/src/lib/prisma";
import { LoadsTableClient } from "./LoadsTableClient";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Update List & Dispatch Board | Easy Trucking",
  description: "Real-time fleet dispatch, load updates, and ETA tracking",
};

async function LoadsContent() {
  const session = await auth();

  if (!session?.user?.id || !session?.user?.companyId) {
    redirect("/login");
  }

  // Fetch all company loads ordered by latest update
  const loads = await prisma.load.findMany({
    where: { companyId: session.user.companyId },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <LoadsTableClient
      initialLoads={loads}
      companyId={session.user.companyId}
      userRole={session.user.role}
    />
  );
}

export default function LoadsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="text-xs font-semibold text-slate-400">
              Loading Dispatch Board & Update List...
            </span>
          </div>
        </div>
      }
    >
      <LoadsContent />
    </Suspense>
  );
}
