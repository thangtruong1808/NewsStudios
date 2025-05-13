import { z } from "zod";

// Schema for creating a new user
export const createUserSchema = z.object({
  firstname: z.string().min(2, "First name must be at least 2 characters"),
  lastname: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .refine((val) => {
      if (!val) {
        return false;
      }
      return true;
    }, "Password is required"),
  role: z.enum(["admin", "user", "editor"]),
  status: z.enum(["active", "inactive"]),
  description: z.string().optional(),
  user_image: z.string().default(""),
});

// Schema for editing an existing user
export const editUserSchema = z.object({
  firstname: z.string().min(2, "First name must be at least 2 characters"),
  lastname: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional()
    .or(z.literal("")), // Allow empty string for updates
  role: z.enum(["admin", "user", "editor"]),
  status: z.enum(["active", "inactive"]),
  description: z.string().optional(),
  user_image: z.string().default(""),
});

// Export the base schema for backward compatibility
export const userSchema = createUserSchema;

export type UserFormValues = z.infer<typeof userSchema>;
