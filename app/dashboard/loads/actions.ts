"use server";

import { auth } from "@/src/auth";
import { prisma } from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";
import type { LoadStatus } from "@prisma/client";
import { SAMPLE_DISPATCH_LOADS } from "./constants";

// Guard helper to verify authenticated user belonging to company
async function getAuthContext() {
  const session = await auth();
  if (!session?.user?.id || !session?.user?.companyId) {
    throw new Error("Unauthorized. Please log in.");
  }
  return {
    userId: session.user.id,
    companyId: session.user.companyId,
    userName: session.user.name || "Dispatcher",
  };
}

// 1. Seed Sample Loads Action
export async function seedSampleLoadsAction() {
  try {
    const { userId, companyId, userName } = await getAuthContext();

    for (const load of SAMPLE_DISPATCH_LOADS) {
      await prisma.load.create({
        data: {
          ...load,
          companyId,
          createdById: userId,
        },
      });
    }

    await prisma.activityLog.create({
      data: {
        companyId,
        userId,
        action: "LOADS_SEEDED",
        details: `${userName} seeded 8 sample loads onto the dispatch board.`,
      },
    });

    revalidatePath("/dashboard/loads");
    return { success: true, message: "8 sample loads added successfully." };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to seed loads.",
    };
  }
}

// 2. Create Load Action
export async function createLoadAction(formData: FormData) {
  try {
    const { userId, companyId, userName } = await getAuthContext();

    const loadNumber = formData.get("loadNumber")?.toString().trim();
    const unitNumber = formData.get("unitNumber")?.toString().trim();
    const plate = formData.get("plate")?.toString().trim() || "";
    const driverName = formData.get("driverName")?.toString().trim();
    const phoneNumber = formData.get("phoneNumber")?.toString().trim() || "";
    const route = formData.get("route")?.toString().trim();
    const milesStr = formData.get("miles")?.toString().trim() || "0";
    const currentLocation =
      formData.get("currentLocation")?.toString().trim() || "Terminal";
    const eta = formData.get("eta")?.toString().trim() || "TBD";
    const status = (formData.get("status")?.toString() ||
      "DISPATCHED") as LoadStatus;
    const brokerCompany =
      formData.get("brokerCompany")?.toString().trim() || "Direct Carrier";
    const ratePercent =
      formData.get("ratePercent")?.toString().trim() || "$0 / 0%";
    const reserve = formData.get("reserve")?.toString().trim() || "$0";
    const notes = formData.get("notes")?.toString().trim() || "";

    if (!loadNumber || !unitNumber || !driverName || !route) {
      return {
        success: false,
        error: "Load ID, Unit #, Driver Name, and Route are required.",
      };
    }

    const miles = parseInt(milesStr.replace(/[^0-9]/g, ""), 10) || 0;

    const newLoad = await prisma.load.create({
      data: {
        loadNumber,
        unitNumber,
        plate,
        driverName,
        phoneNumber,
        route,
        miles,
        currentLocation,
        eta,
        status,
        brokerCompany,
        ratePercent,
        reserve,
        notes,
        companyId,
        createdById: userId,
      },
    });

    await prisma.activityLog.create({
      data: {
        companyId,
        userId,
        action: "LOAD_CREATED",
        details: `${userName} created load #${loadNumber} (${driverName} - ${unitNumber}).`,
      },
    });

    revalidatePath("/dashboard/loads");
    return { success: true, load: newLoad };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create load.",
    };
  }
}

// 3. Update Full Load Action
export async function updateLoadAction(loadId: string, formData: FormData) {
  try {
    const { userId, companyId, userName } = await getAuthContext();

    const existing = await prisma.load.findUnique({
      where: { id: loadId },
    });

    if (!existing || existing.companyId !== companyId) {
      return { success: false, error: "Load not found or unauthorized." };
    }

    const loadNumber =
      formData.get("loadNumber")?.toString().trim() || existing.loadNumber;
    const unitNumber =
      formData.get("unitNumber")?.toString().trim() || existing.unitNumber;
    const plate = formData.get("plate")?.toString().trim() ?? existing.plate;
    const driverName =
      formData.get("driverName")?.toString().trim() || existing.driverName;
    const phoneNumber =
      formData.get("phoneNumber")?.toString().trim() ?? existing.phoneNumber;
    const route = formData.get("route")?.toString().trim() || existing.route;
    const milesStr =
      formData.get("miles")?.toString().trim() || String(existing.miles);
    const currentLocation =
      formData.get("currentLocation")?.toString().trim() ??
      existing.currentLocation;
    const eta = formData.get("eta")?.toString().trim() ?? existing.eta;
    const status = (formData.get("status")?.toString() ||
      existing.status) as LoadStatus;
    const brokerCompany =
      formData.get("brokerCompany")?.toString().trim() ??
      existing.brokerCompany;
    const ratePercent =
      formData.get("ratePercent")?.toString().trim() ?? existing.ratePercent;
    const reserve =
      formData.get("reserve")?.toString().trim() ?? existing.reserve;
    const notes = formData.get("notes")?.toString().trim() ?? existing.notes;

    const miles = parseInt(milesStr.replace(/[^0-9]/g, ""), 10) || 0;

    const updated = await prisma.load.update({
      where: { id: loadId },
      data: {
        loadNumber,
        unitNumber,
        plate,
        driverName,
        phoneNumber,
        route,
        miles,
        currentLocation,
        eta,
        status,
        brokerCompany,
        ratePercent,
        reserve,
        notes,
      },
    });

    await prisma.activityLog.create({
      data: {
        companyId,
        userId,
        action: "LOAD_UPDATED",
        details: `${userName} updated full details for load #${loadNumber}.`,
      },
    });

    revalidatePath("/dashboard/loads");
    return { success: true, load: updated };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update load.",
    };
  }
}

// 4. Update Load Status Action (for instant status dropdown pill)
export async function updateLoadStatusAction(
  loadId: string,
  newStatus: LoadStatus
) {
  try {
    const { userId, companyId, userName } = await getAuthContext();

    const existing = await prisma.load.findUnique({
      where: { id: loadId },
      select: { id: true, companyId: true, loadNumber: true, status: true },
    });

    if (!existing || existing.companyId !== companyId) {
      return { success: false, error: "Load not found or unauthorized." };
    }

    const updated = await prisma.load.update({
      where: { id: loadId },
      data: { status: newStatus },
    });

    await prisma.activityLog.create({
      data: {
        companyId,
        userId,
        action: "LOAD_STATUS_UPDATED",
        details: `${userName} updated load #${existing.loadNumber} status from ${existing.status} to ${newStatus}.`,
      },
    });

    revalidatePath("/dashboard/loads");
    return { success: true, load: updated };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update load status.",
    };
  }
}

// 5. Update Inline Field Action (currentLocation, eta, notes)
export async function updateLoadInlineAction(
  loadId: string,
  field: "currentLocation" | "eta" | "notes",
  value: string
) {
  try {
    const { userId, companyId, userName } = await getAuthContext();

    const existing = await prisma.load.findUnique({
      where: { id: loadId },
      select: { id: true, companyId: true, loadNumber: true },
    });

    if (!existing || existing.companyId !== companyId) {
      return { success: false, error: "Load not found or unauthorized." };
    }

    const updated = await prisma.load.update({
      where: { id: loadId },
      data: { [field]: value },
    });

    await prisma.activityLog.create({
      data: {
        companyId,
        userId,
        action: "LOAD_UPDATED",
        details: `${userName} updated ${field} for load #${existing.loadNumber}.`,
      },
    });

    revalidatePath("/dashboard/loads");
    return { success: true, load: updated };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update field.",
    };
  }
}

// 6. Delete Load Action
export async function deleteLoadAction(loadId: string) {
  try {
    const { userId, companyId, userName } = await getAuthContext();

    const existing = await prisma.load.findUnique({
      where: { id: loadId },
      select: { id: true, companyId: true, loadNumber: true },
    });

    if (!existing || existing.companyId !== companyId) {
      return { success: false, error: "Load not found or unauthorized." };
    }

    await prisma.load.delete({
      where: { id: loadId },
    });

    await prisma.activityLog.create({
      data: {
        companyId,
        userId,
        action: "LOAD_DELETED",
        details: `${userName} deleted load #${existing.loadNumber}.`,
      },
    });

    revalidatePath("/dashboard/loads");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete load.",
    };
  }
}
