// Component Info
// Description: TypeScript interfaces for navigation menu components.
// Date created: 2025-01-27
// Author: thangtruong

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
  isActive?: (_routePath: string) => boolean; // Optional: currently not used but kept for future use
  activeCategoryId?: number | null;
  activeSubcategoryId?: number | null;
}
