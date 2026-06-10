// Shared utility functions.

// Formats a number as a Thai-locale integer string (e.g. 1400 → "1,400").
// Callers are responsible for the ฿ prefix and any +/- sign.
export const formatBaht = (amount: number): string =>
  amount.toLocaleString("th-TH");
