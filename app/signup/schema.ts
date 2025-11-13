import { z } from "zod";

// Schema Info
// Description: Validation rules for sign-up fields using zod.
// Data created: Typed schema for react-hook-form integration on the sign-up page.
// Author: thangtruong

export const signUpSchema = z
  .object({
    firstname: z.string().trim().min(1, "First name is required."),
    lastname: z.string().trim().min(1, "Last name is required."),
    email: z
      .string()
      .trim()
      .min(1, "Email address is required.")
      .email("Please provide a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
    description: z
      .string()
      .max(160, "Short bio must be 160 characters or less.")
      .optional()
      .or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match.",
        path: ["confirmPassword"],
      });
    }
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;
