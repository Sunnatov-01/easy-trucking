import type { NextAuthConfig } from "next-auth";
import type { AccountStatus, Department, Role } from "@prisma/client";

export const authConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.department = user.department;
        token.status = user.status;
        token.companyId = user.companyId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.department = (token.department as Department | null) ?? null;
        session.user.status = token.status as AccountStatus;
        session.user.companyId = token.companyId as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;