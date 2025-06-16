export interface Media {
  type: 'image' | 'video';
  url: string;
  id?: number;
  description?: string;
}

export interface ArticleMediaProps {
  selectedImage: string | null;
  articleTitle: string;
  additionalMedia: {
    images: Array<{
      id: number;
      url: string;
      description?: string;
      isMainImage?: boolean;
    }>;
    videos: Array<{
      id: number;
      url: string;
      description?: string;
    }>;
  };
  onImageClick: (url: string) => void;
  onVideoClick: (url: string) => void;
  selectedVideo: string | null;
  onCloseVideoModal: () => void;
  articleId: number;
} 