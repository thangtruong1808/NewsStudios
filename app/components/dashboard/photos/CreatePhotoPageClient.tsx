"use client";

import { Article } from "@/app/lib/definition";
import PhotoFormContainer from "./form/PhotoFormContainer";

/**
 * Props interface for CreatePhotoPageClient component
 * @property articles - List of available articles for photo association
 */
interface CreatePhotoPageClientProps {
  articles: Article[];
}

/**
 * CreatePhotoPageClient Component
 * Client component for the photo creation page
 */
export default function CreatePhotoPageClient({
  articles,
}: CreatePhotoPageClientProps) {
  return (
    <div className="w-full">
      <PhotoFormContainer articles={articles} />
    </div>
  );
}
