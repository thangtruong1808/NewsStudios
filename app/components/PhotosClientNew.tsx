import { useState } from "react";
import ServerImage from "./ServerImage";

interface Photo {
  id: number;
  image_url: string;
  title: string;
  description: string;
}

interface PhotosClientNewProps {
  photos: Photo[];
}

const PhotosClientNew: React.FC<PhotosClientNewProps> = ({ photos }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="relative cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          onClick={() => setSelectedPhoto(photo)}
        >
          <ServerImage
            imageData={photo.image_url}
            alt={photo.title}
            width={400}
            height={300}
            className="object-cover w-full h-full"
            useDirectUrl={true}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
            <h3 className="text-lg font-semibold">{photo.title}</h3>
            <p className="text-sm">{photo.description}</p>
          </div>
        </div>
      ))}

      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full p-4">
            <div className="relative">
              <ServerImage
                imageData={selectedPhoto.image_url}
                alt={selectedPhoto.title}
                width={800}
                height={600}
                className="w-full h-auto"
                useDirectUrl={false}
              />
              <button
                className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                onClick={() => setSelectedPhoto(null)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="mt-4">
              <h2 className="text-2xl font-bold">{selectedPhoto.title}</h2>
              <p className="mt-2 text-gray-600">{selectedPhoto.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotosClientNew;
