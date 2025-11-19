import { use, Suspense } from "react";
import NavBarClient from "./NavBarClient";
import { getNavCategories } from "@/app/lib/actions/categories";

// Component Info
// Description: Server wrapper preparing navigation data for the client navbar.
// Date created: 2025-01-27
// Author: thangtruong

const navCategoriesPromise = getNavCategories();

function NavBarContent() {
  const result = use(navCategoriesPromise);
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
