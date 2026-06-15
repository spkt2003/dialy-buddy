// Shared types used across multiple components. Add new cross-cutting types here.

export interface Message {
  id: number;
  sender: "caregiver" | "patient";
  text: string;
  readAt?: number;
}
