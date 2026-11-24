import { Suspense } from "react";
import { auth } from "@/src/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/src/lib/prisma";
import { ProfileClient } from "./ProfileClient";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Account Profile & Settings | Easy Trucking",
  description: "Manage personal credentials, company details, and password",
};

async function ProfileData() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      department: true,
      status: true,
      createdAt: true,
      company: {
        select: {
          id: true,
          name: true,
          companyCode: true,
          plan: true,
          subscriptionStatus: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  return <ProfileClient user={user} />;
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="text-xs font-semibold text-slate-400">
              Loading Profile & Settings...
            </span>
          </div>
        </div>
      }
    >
      <ProfileData />
    </Suspense>
  );
}
