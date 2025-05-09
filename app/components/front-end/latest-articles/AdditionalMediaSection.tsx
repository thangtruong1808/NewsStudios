import { AdditionalMediaSectionProps } from "./types";
import { MediaThumbnail } from "./MediaThumbnail";

export const AdditionalMediaSection = ({
  media,
  onImageClick,
  onVideoClick,
}: AdditionalMediaSectionProps) => {
  if (media.images.length === 0 && media.videos.length === 0) return null;

  return (
    <div className="mt-4 border-t pt-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">
        Additional Media
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {media.images.map((image) => (
          <MediaThumbnail
            key={`image-${image.id}`}
            type="image"
            item={image}
            onClick={onImageClick}
          />
        ))}
        {media.videos.map((video) => (
          <MediaThumbnail
            key={`video-${video.id}`}
            type="video"
            item={video}
            onClick={onVideoClick}
          />
        ))}
      </div>
    </div>
  );
};
