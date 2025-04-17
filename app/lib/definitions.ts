export interface Sponsor {
  id: number;
  name: string;
  contact_email?: string;
  contact_phone?: string;
  website_url?: string;
  image_url?: string;
  video_url?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  category_id: number;
  author_id: number;
  user_id: number;
  image_url: string;
  video_url: string;
  headline_priority: number;
  headline_image_url: string;
  headline_video_url: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Advertisement {
  id: number;
  sponsor_id: number;
  article_id: number;
  category_id: number;
  start_date: string;
  end_date: string;
  ad_type: string;
  ad_content: string;
  image_url?: string;
  video_url?: string;
  created_at: string;
  updated_at: string;
}
