import { z } from "zod";

export const tagSchema = z.object({
  name: z.string().min(2, "Tag name must be at least 2 characters"),
  description: z.string().optional(),
  color: z
    .string()
    .regex(
      /^#[0-9A-Fa-f]{6}$/,
      "Color must be a valid hex code (e.g., #FF5733)"
    )
    .optional(),
});

export type TagFormData = z.infer<typeof tagSchema>;
