import { use } from "react";
import { getNavCategories } from "@/app/lib/actions/categories";
import TagsClient from "./TagsClient";

// Component Info
// Description: Server wrapper supplying navigation categories to the tags client UI.
// Date created: 2025-01-27
// Author: thangtruong

const navCategoriesPromise = getNavCategories();

export default function Tags() {
  const { data } = use(navCategoriesPromise);
  return <TagsClient categories={data ?? []} />;
}
