import { auth } from "@/src/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

async function AuthGate() {
  const session = await auth();

  if (!session?.user) {
    redirect("/register");
  }

  if (session.user.status === "PENDING") {
    redirect("/pending");
  }

  redirect("/dashboard");
  return null;
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50/70 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <AuthGate />
    </Suspense>
  );
}
