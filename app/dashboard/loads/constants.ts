import type { LoadStatus } from "@prisma/client";

// Sample loads used by the "Seed Sample Loads" action
// Kept here (not in actions.ts) so the "use server" file only exports async functions.
export const SAMPLE_DISPATCH_LOADS: Array<{
  loadNumber: string;
  unitNumber: string;
  plate: string;
  driverName: string;
  phoneNumber: string;
  route: string;
  miles: number;
  currentLocation: string;
  eta: string;
  status: LoadStatus;
  brokerCompany: string;
  ratePercent: string;
  reserve: string;
  notes: string;
}> = [
  {
    loadNumber: "LD-4821",
    unitNumber: "TRK-104",
    plate: "IL-94821",
    driverName: "Marcus Vance",
    phoneNumber: "(312) 555-0144",
    route: "Chicago, IL -> Dallas, TX",
    miles: 924,
    currentLocation: "St. Louis, MO (I-55 S)",
    eta: "Tomorrow 08:30 AM",
    status: "IN_TRANSIT",
    brokerCompany: "C.H. Robinson",
    ratePercent: "$3,450 / 12%",
    reserve: "$350",
    notes: "No touch freight; reefer set at -10F continuous.",
  },
  {
    loadNumber: "LD-4822",
    unitNumber: "TRK-208",
    plate: "TX-58190",
    driverName: "Dmitri Volkov",
    phoneNumber: "(214) 555-0812",
    route: "Atlanta, GA -> Miami, FL",
    miles: 663,
    currentLocation: "Macon, GA (I-75 S)",
    eta: "Today 11:45 PM",
    status: "AT_PICKUP",
    brokerCompany: "TQL Logistics",
    ratePercent: "$2,850 / 10%",
    reserve: "$250",
    notes: "Shipper check-in at Gate 3. High-value cargo seal verified.",
  },
  {
    loadNumber: "LD-4823",
    unitNumber: "TRK-315",
    plate: "OH-33918",
    driverName: "Carlos Mendez",
    phoneNumber: "(614) 555-9201",
    route: "Columbus, OH -> Allentown, PA",
    miles: 418,
    currentLocation: "Pittsburgh, PA (I-76 E)",
    eta: "Today 04:15 PM",
    status: "AT_DELIVERY",
    brokerCompany: "Echo Global Logistics",
    ratePercent: "$2,100 / 12%",
    reserve: "$0",
    notes: "Consignee dock 12. Receiver requires pallet jack offload.",
  },
  {
    loadNumber: "LD-4824",
    unitNumber: "TRK-410",
    plate: "CA-77201",
    driverName: "Elijah Brooks",
    phoneNumber: "(213) 555-4491",
    route: "Los Angeles, CA -> Phoenix, AZ",
    miles: 372,
    currentLocation: "Ontario, CA Yard",
    eta: "Tomorrow 06:00 AM",
    status: "DISPATCHED",
    brokerCompany: "Landstar Global",
    ratePercent: "$1,850 / 10%",
    reserve: "$150",
    notes: "Pre-loaded trailer #5309 ready. Driver en route to yard.",
  },
  {
    loadNumber: "LD-4825",
    unitNumber: "TRK-502",
    plate: "MI-61294",
    driverName: "Tariq Al-Mansoor",
    phoneNumber: "(313) 555-7319",
    route: "Detroit, MI -> Nashville, TN",
    miles: 536,
    currentLocation: "Cincinnati, OH (I-71 S)",
    eta: "Tomorrow 10:00 AM",
    status: "IN_TRANSIT",
    brokerCompany: "Coyote Logistics",
    ratePercent: "$2,650 / 11%",
    reserve: "$200",
    notes: "Auto parts priority shipment. Expedited team run.",
  },
  {
    loadNumber: "LD-4826",
    unitNumber: "TRK-119",
    plate: "IN-40192",
    driverName: "Brendan Hayes",
    phoneNumber: "(317) 555-8832",
    route: "Indianapolis, IN -> Charlotte, NC",
    miles: 588,
    currentLocation: "Knoxville, TN (I-40 E)",
    eta: "Yesterday 05:30 PM",
    status: "DELIVERED",
    brokerCompany: "JB Hunt Integrated",
    ratePercent: "$2,950 / 12%",
    reserve: "$300",
    notes: "Signed BOL uploaded. Consignee stamped clean delivery.",
  },
  {
    loadNumber: "LD-4827",
    unitNumber: "TRK-224",
    plate: "PA-88104",
    driverName: "Mateo Rossi",
    phoneNumber: "(215) 555-6671",
    route: "Newark, NJ -> Savannah, GA",
    miles: 755,
    currentLocation: "Richmond, VA Yard",
    eta: "Pending Broker Release",
    status: "HOLD",
    brokerCompany: "Uber Freight",
    ratePercent: "$3,100 / 12%",
    reserve: "$400",
    notes: "Broker credit review pending. Do not dispatch until cleared.",
  },
  {
    loadNumber: "LD-4828",
    unitNumber: "TRK-330",
    plate: "FL-19823",
    driverName: "Serhei Kovalchuk",
    phoneNumber: "(407) 555-3312",
    route: "Orlando, FL -> Memphis, TN",
    miles: 729,
    currentLocation: "Valdosta, GA Rest Area",
    eta: "Tomorrow 02:00 PM",
    status: "IN_TRANSIT",
    brokerCompany: "Worldwide Express",
    ratePercent: "$3,300 / 10%",
    reserve: "$0",
    notes: "Produce load. Check temperature every 3 hours.",
  },
];

// All valid LoadStatus values in display order
export const ALL_LOAD_STATUSES = [
  "DISPATCHED",
  "AT_PICKUP",
  "IN_TRANSIT",
  "AT_DELIVERY",
  "DELIVERED",
  "HOLD",
] as const satisfies LoadStatus[];

export type StatusConfig = {
  label: string;
  badgeClass: string;
  dotClass: string;
};

// Status display configuration (safe to import in both client and server files)
export const STATUS_CONFIG: Record<LoadStatus, StatusConfig> = {
  DISPATCHED: {
    label: "Dispatched",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200/80",
    dotClass: "bg-blue-500",
  },
  AT_PICKUP: {
    label: "At Pickup",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200/80",
    dotClass: "bg-amber-500",
  },
  IN_TRANSIT: {
    label: "In Transit",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    dotClass: "bg-emerald-500 animate-pulse",
  },
  AT_DELIVERY: {
    label: "At Delivery",
    badgeClass: "bg-sky-50 text-sky-700 border-sky-200/80",
    dotClass: "bg-sky-500",
  },
  DELIVERED: {
    label: "Delivered",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
    dotClass: "bg-slate-400",
  },
  HOLD: {
    label: "Hold",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200/80",
    dotClass: "bg-rose-500",
  },
};
