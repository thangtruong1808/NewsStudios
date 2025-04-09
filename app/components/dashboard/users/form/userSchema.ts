import { z } from "zod";

export const userSchema = z.object({
  firstname: z.string().min(2, "First name must be at least 2 characters"),
  lastname: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
  role: z.enum(["admin", "user", "editor"]),
  status: z.enum(["active", "inactive"]),
  description: z.string().optional(),
});

export type UserFormValues = z.infer<typeof userSchema>;
