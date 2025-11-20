import { Metadata } from "next";
import SearchPageClient from "./SearchPageClient";

// Component Info
// Description: Server component rendering search results page with metadata.
// Date updated: 2025-November-21
// Author: thangtruong

export const metadata: Metadata = {
  title: "Search Articles | NewsStudios",
  description: "Search and filter articles by title, categories, and subcategories.",
};

export default function SearchPage() {
  return <SearchPageClient />;
}

