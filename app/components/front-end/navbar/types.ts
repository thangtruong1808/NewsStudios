import { Category } from "@/app/lib/definition";

export interface NavMenuSubcategory {
  id: number;
  name: string;
}

export interface NavMenuCategory {
  id: number;
  name: string;
  subcategories: NavMenuSubcategory[];
}

export interface MenuProps {
  categories: NavMenuCategory[];
  isActive: (path: string) => boolean;
}
