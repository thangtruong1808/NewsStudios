import { z } from "zod";

export const imageSchema = z.object({
  article_id: z.number().nullable(),
  image_url: z.string().url("Please enter a valid URL"),
  description: z.string().nullable(),
  type: z.enum(["banner", "video", "thumbnail", "gallery"]),
  entity_type: z.enum(["advertisement", "article", "author", "category"]),
  entity_id: z.number(),
  is_featured: z.boolean().default(false),
  display_order: z.number().default(0),
});

export type ImageFormData = z.infer<typeof imageSchema>;
