import { z } from "zod";

export interface TagFormValues {
  name: string;
  description?: string;
  color?: string;
  category_id: number;
  sub_category_id: number;
}

export const tagSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  color: z.string().optional(),
  category_id: z.number().min(1, "Category is required"),
  sub_category_id: z.number().min(1, "SubCategory is required"),
});
