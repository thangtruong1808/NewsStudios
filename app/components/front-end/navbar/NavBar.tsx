import { use, Suspense, cache } from "react";
import NavBarClient from "./NavBarClient";
import { getNavCategories } from "@/app/lib/actions/categories";

// Component Info
// Description: Server wrapper preparing navigation data for the client navbar.
// Date updated: 2025-November-21
// Author: thangtruong

// Cache the promise per request to avoid duplicate calls
const getCachedNavCategories = cache(() => getNavCategories());

function NavBarContent() {
  // Create promise per request using cache
  const navCategoriesPromise = getCachedNavCategories();
  const result = use(navCategoriesPromise);
  // Use data if available, otherwise fallback to empty array
  // Error is silently handled to prevent UI breakage
  const categories = result.data ?? [];
  return <NavBarClient categories={categories} />;
}

export default function NavBar() {
  return (
    <Suspense fallback={<div className="h-16 w-full bg-white border-b border-slate-200" />}>
      <NavBarContent />
    </Suspense>
  );
}
