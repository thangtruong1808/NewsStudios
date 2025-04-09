import { z } from "zod";

export const imageSchema = z.object({
  article_id: z.number().nullable(),
  image_url: z.string().url("Please enter a valid URL"),
  description: z.string().nullable(),
});

export type ImageFormData = z.infer<typeof imageSchema>;
