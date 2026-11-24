import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/src/lib/prisma";
import type { Department } from "@prisma/client";

const VALID_DEPARTMENTS: Department[] = [
  "DISPATCHER",
  "UPDATER",
  "ACCOUNTING",
  "SAFETY",
  "FLEET",
  "HR",
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, companyCode, department } = body as {
      name?: string;
      email?: string;
      password?: string;
      companyCode?: string;
      department?: string;
    };

    if (!name || !email || !password || !companyCode || !department) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    if (!VALID_DEPARTMENTS.includes(department as Department)) {
      return NextResponse.json(
        { error: "Invalid department." },
        { status: 400 }
      );
    }

    const company = await prisma.company.findUnique({
      where: { companyCode: companyCode.toUpperCase() },
    });

    if (!company) {
      return NextResponse.json(
        { error: "No company found with that code." },
        { status: 404 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 12);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "EMPLOYEE",
        department: department as Department,
        status: "PENDING",
        companyId: company.id,
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
