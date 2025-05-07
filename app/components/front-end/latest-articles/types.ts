import { Article } from "@/app/lib/definition";

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
  onImageClick: (url: string) => void;
  onVideoClick: (url: string) => void;
}

export interface MainMediaDisplayProps {
  selectedImage: string | null;
  article: Article;
}

export interface VideoModalProps {
  videoUrl: string | null;
  onClose: () => void;
}
