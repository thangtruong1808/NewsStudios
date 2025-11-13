import { use } from "react";
import NavBarClient from "./NavBarClient";
import { getNavCategories } from "@/app/lib/actions/categories";

// Component Info
// Description: Server wrapper preparing navigation data for the client navbar.
// Data created: Category and subcategory lists sourced from the database.
// Author: thangtruong

const navCategoriesPromise = getNavCategories();

export default function NavBar() {
  const { data: categories } = use(navCategoriesPromise);

  return <NavBarClient categories={categories ?? []} />;
}
