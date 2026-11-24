"use server";

import { auth } from "@/src/auth";
import { prisma } from "@/src/lib/prisma";
import { compare, hash } from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function updatePersonalInfo(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized. Please log in." };
  }

  const name = formData.get("name")?.toString().trim();
  if (!name || name.length < 2) {
    return { success: false, error: "Name must be at least 2 characters long." };
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { name },
    });

    // Revalidate dashboard layout so Sidebar Account Card and Top Header update immediately
    revalidatePath("/dashboard", "layout");
    revalidatePath("/dashboard/profile");
    return { success: true, message: "Your profile name has been updated." };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update profile name.",
    };
  }
}

// Alias for component import compatibility
export const updateProfileName = updatePersonalInfo;

export async function updateCompanyInfo(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id || !session?.user?.companyId) {
    return { success: false, error: "Unauthorized. Please log in." };
  }

  if (session.user.role !== "COMPANY") {
    return {
      success: false,
      error: "Only Carrier Owners are authorized to update the company name.",
    };
  }

  const companyName = formData.get("companyName")?.toString().trim();
  if (!companyName || companyName.length < 2) {
    return {
      success: false,
      error: "Company name must be at least 2 characters long.",
    };
  }

  try {
    await prisma.company.update({
      where: { id: session.user.companyId },
      data: { name: companyName },
    });

    // Revalidate dashboard layout so Top Header breadcrumb and Sidebar update immediately
    revalidatePath("/dashboard", "layout");
    revalidatePath("/dashboard/profile");
    return { success: true, message: "Company name has been updated." };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update company name.",
    };
  }
}

// Alias for component import compatibility
export const updateCompanyName = updateCompanyInfo;

export async function changePassword(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized. Please log in." };
  }

  const currentPassword = formData.get("currentPassword")?.toString() || "";
  const newPassword = formData.get("newPassword")?.toString() || "";
  const confirmPassword = formData.get("confirmPassword")?.toString() || "";

  if (!currentPassword) {
    return { success: false, error: "Please enter your current password." };
  }

  if (newPassword.length < 8) {
    return {
      success: false,
      error: "New password must be at least 8 characters long.",
    };
  }

  if (newPassword !== confirmPassword) {
    return { success: false, error: "New passwords do not match." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    });

    if (!user) {
      return { success: false, error: "User account not found." };
    }

    const isMatch = await compare(currentPassword, user.password);
    if (!isMatch) {
      return { success: false, error: "Current password is incorrect." };
    }

    const hashedPassword = await hash(newPassword, 12);
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    });

    return {
      success: true,
      message: "Your password has been changed successfully.",
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update password.",
    };
  }
}
