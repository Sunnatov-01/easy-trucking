import { auth } from "@/src/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/src/lib/prisma";
import { Sidebar } from "@/src/components/dashboard/Sidebar";
import { Header } from "@/src/components/dashboard/Header";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

async function AuthenticatedDashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Authentication Guard
  if (!session?.user?.id) {
    redirect("/register");
  }

  // Fetch fresh user & company directly from Prisma database to avoid stale JWT cache
  const freshUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { company: true },
  });

  if (!freshUser) {
    redirect("/register");
  }

  // Approval Guard
  if (freshUser.status === "PENDING") {
    redirect("/pending");
  }

  const company = freshUser.company;
  const freshUserName = freshUser.name || company?.name || "Easy Trucking";
  const freshCompanyName = company?.name || freshUser.name || "Easy Trucking";

  return (
    <div className="min-h-screen bg-slate-50/70 flex text-slate-900 font-sans antialiased">
      {/* Fixed Left Sidebar */}
      <Sidebar
        userRole={freshUser.role}
        user={{
          name: freshUserName,
          email: freshUser.email,
          role: freshUser.role,
          department: freshUser.department,
        }}
        companyName={freshCompanyName}
      />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out">
        {/* Top Header */}
        <Header
          user={{
            name: freshUserName,
            email: freshUser.email,
            role: freshUser.role,
            department: freshUser.department,
          }}
          companyName={freshCompanyName}
        />

        {/* Scrollable Page Body */}
        <main className="flex-1 p-6 sm:p-8 max-w-[1600px] w-full mx-auto transition-all duration-300 ease-in-out">
          {children}
        </main>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50/70 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="text-xs font-semibold text-slate-400">
          Loading Easy Trucking...
        </span>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <AuthenticatedDashboardShell>{children}</AuthenticatedDashboardShell>
    </Suspense>
  );
}
