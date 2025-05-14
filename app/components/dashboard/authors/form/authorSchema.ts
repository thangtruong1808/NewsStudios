import { z } from "zod";

export const authorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  bio: z.string().optional(),
});

export type AuthorFormData = z.infer<typeof authorSchema>;
