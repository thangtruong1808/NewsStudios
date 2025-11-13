/* eslint-disable no-unused-vars */
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
  onImageClick: (imageUrl: string) => void;
  onVideoClick: (videoUrl: string) => void;
  selectedVideo: string | null;
  onCloseVideoModal: () => void;
}
/* eslint-enable no-unused-vars */