import { z } from "zod";

export const sponsorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  contact_email: z
    .string()
    .email("Invalid email format")
    .optional()
    .or(z.literal("")),
  contact_phone: z.string().optional().or(z.literal("")),
  website_url: z
    .string()
    .url("Invalid URL format")
    .optional()
    .or(z.literal("")),
  image_url: z.string().url("Invalid URL format").optional().or(z.literal("")),
  video_url: z.string().url("Invalid URL format").optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
});

export type SponsorFormData = z.infer<typeof sponsorSchema>;
