import { z } from "zod";

export interface TagFormValues {
  name: string;
  description?: string;
  color?: string;
}

export const tagSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  color: z.string().optional(),
});
