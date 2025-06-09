"use client";

import { Article, Image } from "@/app/lib/definition";
import PhotoFormContainer from "./form/PhotoFormContainer";

/**
 * Props interface for CreatePhotoPageClient component
 * @property articles - List of available articles for photo association
 * @property image - Optional existing image for editing
 */
interface CreatePhotoPageClientProps {
  articles: Article[];
  image?: Image;
}

/**
 * CreatePhotoPageClient Component
 * Client component for the photo creation page
 */
export default function CreatePhotoPageClient({
  articles,
  image,
}: CreatePhotoPageClientProps) {
  return (
    <div className="w-full">
      <PhotoFormContainer
        image={image}
        mode={image ? "edit" : "create"}
        articles={articles}
      />
    </div>
  );
}
