import type { Article } from "@/app/lib/definition";

/* eslint-disable no-unused-vars */
export interface MediaItem {
  id: number;
  url: string;
  description?: string;
  isMainImage?: boolean;
}

export interface AdditionalMedia {
  images: MediaItem[];
  videos: MediaItem[];
}

export interface ArticleProps {
  article: Article;
}

export interface MediaThumbnailProps {
  type: "image" | "video";
  item: MediaItem;
  onClick: (url: string) => void;
}

export interface AdditionalMediaSectionProps {
  media: AdditionalMedia;
  onImageClick: (imageUrl: string) => void;
  onVideoClick: (videoUrl: string) => void;
}

export interface MainMediaDisplayProps {
  selectedImage: string | null;
  article: Article;
}

export interface VideoModalProps {
  videoUrl: string | null;
  onClose: () => void;
}
/* eslint-enable no-unused-vars */
