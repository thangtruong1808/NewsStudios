import { z } from "zod";

export const subcategorySchema = z.object({
  name: z.string().min(2, "Subcategory name must be at least 2 characters"),
  description: z.string().nullable(),
  category_id: z.number().min(1, "Category is required"),
});

export type SubcategoryFormData = z.infer<typeof subcategorySchema>;
