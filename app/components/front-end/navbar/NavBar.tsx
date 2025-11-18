import { use } from "react";
import NavBarClient from "./NavBarClient";
import { getNavCategories } from "@/app/lib/actions/categories";

// Component Info
// Description: Server wrapper preparing navigation data for the client navbar.
// Date created: 2024
// Author: thangtruong

const navCategoriesPromise = getNavCategories();

export default function NavBar() {
  const result = use(navCategoriesPromise);
  const categories = result.data ?? [];

  return <NavBarClient categories={categories} />;
}
