import { z } from "zod";

export const subcategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  category_id: z.number().min(1, "Category is required"),
});

export type SubcategoryFormData = z.infer<typeof subcategorySchema>;
