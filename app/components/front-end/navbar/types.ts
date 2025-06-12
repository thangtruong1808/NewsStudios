import { Category } from "@/app/lib/definition";

export interface MenuProps {
  categories: Category[];
  isLoading: boolean;
  isActive: (path: string) => boolean;
}
