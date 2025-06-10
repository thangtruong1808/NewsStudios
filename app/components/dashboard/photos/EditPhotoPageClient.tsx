"use client";

import { Article, Image } from "@/app/lib/definition";
import PhotoFormContainer from "./form/PhotoFormContainer";

interface EditPhotoPageClientProps {
  photo: Image;
  articles: Article[];
}

export default function EditPhotoPageClient({
  photo,
  articles,
}: EditPhotoPageClientProps) {
  return (
    <div className="w-full">
      <PhotoFormContainer articles={articles} image={photo} mode="edit" />
    </div>
  );
}
