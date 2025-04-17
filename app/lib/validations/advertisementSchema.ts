import { z } from "zod";

export const advertisementSchema = z
  .object({
    sponsor_id: z.number().min(1, "Sponsor is required"),
    article_id: z.number().min(1, "Article is required"),
    category_id: z.number().min(1, "Category is required"),
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().min(1, "End date is required"),
    ad_type: z.enum(["banner", "video"], {
      required_error: "Advertisement type is required",
    }),
    ad_content: z.string().min(1, "Advertisement content is required"),
    image_url: z.string().url("Invalid image URL").optional().or(z.literal("")),
    video_url: z.string().url("Invalid video URL").optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      // Ensure end date is after start date
      const start = new Date(data.start_date);
      const end = new Date(data.end_date);
      return end > start;
    },
    {
      message: "End date must be after start date",
      path: ["end_date"],
    }
  )
  .refine(
    (data) => {
      // Ensure at least one of image_url or video_url is provided
      return data.image_url || data.video_url;
    },
    {
      message: "Either image URL or video URL must be provided",
      path: ["image_url"],
    }
  );

export type AdvertisementFormData = z.infer<typeof advertisementSchema>;
