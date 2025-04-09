import { z } from "zod";

export const authorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  bio: z.string().optional(),
});

export type AuthorFormData = z.infer<typeof authorSchema>;
