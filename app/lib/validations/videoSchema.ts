import { z } from "zod";

export const videoSchema = z.object({
  article_id: z.number().min(1, "Article is required"),
  video_url: z.string().url("Must be a valid URL"),
  description: z.string().optional(),
});

export type VideoFormData = z.infer<typeof videoSchema>;
