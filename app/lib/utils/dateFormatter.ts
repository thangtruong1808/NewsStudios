/**
 * Utility functions for date formatting
 */

/**
 * Formats a date string to display day, month (in short form), and year
 * Example: "2024-02-15" becomes "15 Feb 2024"
 * @param dateString - The date string to format
 * @returns Formatted date string
 */
export const formatDateWithMonth = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};
