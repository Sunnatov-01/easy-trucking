import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/src/lib/prisma";
import type { AccountStatus, Department, Role } from "@prisma/client";

// Extend the built-in session/JWT types
declare module "next-auth" {
  interface User {
    id: string;
    role: Role;
    department: Department | null;
    status: AccountStatus;
    companyId: string;
  }
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: Role;
      department: Department | null;
      status: AccountStatus;
      companyId: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    department: Department | null;
    status: AccountStatus;
    companyId: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) return null;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) return null;

        const passwordMatch = await compare(password, user.password);
        if (!passwordMatch) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          status: user.status,
          companyId: user.companyId,
        };
      },
    }),
  ],
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
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.department = token.department;
        session.user.status = token.status;
        session.user.companyId = token.companyId;
      }
      return session;
    },
  },
});
