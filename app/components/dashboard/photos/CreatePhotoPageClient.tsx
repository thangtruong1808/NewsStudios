"use client";

// Component Info
// Description: Client wrapper for photo creation and editing page with article association.
// Date created: 2025-01-27
// Author: thangtruong

import { Article, Image } from "@/app/lib/definition";
import PhotoFormContainer from "./form/PhotoFormContainer";

interface CreatePhotoPageClientProps {
  articles: Article[];
  image?: Image;
}
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
