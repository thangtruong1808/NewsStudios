import { Metadata } from "next";
import SearchPageClient from "./SearchPageClient";

// Component Info
// Description: Server component rendering search results page with metadata.
// Date created: 2025-01-27
// Author: thangtruong

export const metadata: Metadata = {
  title: "Search Articles | NewsStudios",
  description: "Search and filter articles by title, categories, and subcategories.",
};

export default function SearchPage() {
  return <SearchPageClient />;
}

