import { z } from "zod";

export const articleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  category_id: z.coerce.number().min(1, "Category is required"),
  author_id: z.coerce.number().min(1, "Author is required"),
  user_id: z.coerce.number().min(1, "User is required"),
  sub_category_id: z.coerce.number().optional(),
  image: z.string().optional(),
  video: z.string().optional(),
  is_featured: z.boolean().default(false),
  headline_priority: z.coerce.number().default(0),
  is_trending: z.boolean().default(false),
  tag_ids: z.array(z.number()).min(1, "At least one tag is required"),
});

export type ArticleFormData = z.infer<typeof articleSchema>;
