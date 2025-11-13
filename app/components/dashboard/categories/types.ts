import type { ReactNode } from "react";
import type { Category } from "@/app/lib/definition";

// Description: Shared column type used across categories table components.
// Data created: 2024-11-13
// Author: thangtruong
export interface Column<T> {
  field: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: T[keyof T], item: T) => ReactNode;
}
