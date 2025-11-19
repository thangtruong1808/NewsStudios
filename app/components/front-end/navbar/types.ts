/* eslint-disable no-unused-vars */
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
  isActive: (routePath: string) => boolean;
  activeCategoryId?: number | null;
  activeSubcategoryId?: number | null;
}
/* eslint-enable no-unused-vars */
