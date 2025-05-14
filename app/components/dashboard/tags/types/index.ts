import { z } from "zod";

// Tag type definition
export interface Tag {
  id: number;
  name: string;
  description?: string | null;
  color?: string | null;
  created_at: string;
  updated_at: string;
}

// Form values type
export interface TagFormValues {
  name: string;
  description?: string;
  color?: string;
}

// Form schema for validation
export const tagSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  color: z.string().optional(),
});
