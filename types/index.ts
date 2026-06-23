// Shared types used across multiple components. Add new cross-cutting types here.

export interface Message {
  id: number;
  sender: "caregiver" | "patient";
  text: string;
  readAt?: number;
}

export interface PatientTransaction {
  id: string;
  caregiverName: string;
  destination: string;
  date: string;
  timeSlot: string;
  basePay: number;
  platformFee: number;
  discount: number;
  totalPaid: number;
  bookedAt: string;
}
