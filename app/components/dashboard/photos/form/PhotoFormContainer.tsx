"use client";

import type { Article, Image } from "@/app/lib/definition";
import ImageCleanupHandler from "./ImageCleanupHandler";
import PhotoForm from "./PhotoForm";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { usePhotoFormController } from "./usePhotoFormController";

interface PhotoFormContainerProps {
  articles: Article[];
  image?: Image;
  mode: "create" | "edit";
}

// Description: Dashboard container that renders the photo form and manages media cleanup status.
// Data created: Photo submission handlers, cleanup notifications, and form wiring.
// Author: thangtruong
export default function PhotoFormContainer({
  articles,
  image,
  mode,
}: PhotoFormContainerProps) {
  const {
    formValues,
    isSubmitting,
    uploadProgress,
    isImageProcessing,
    previewUrl,
    isFormEmpty,
    isImageAvailable,
    previousImageUrl,
    isCleanupComplete,
    handleSubmit,
    handleInputChange,
    handleFileChange,
    handleClearFile,
    handleCleanupComplete,
  } = usePhotoFormController({ image, mode });

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header section */}
      <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-400">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <PhotoIcon className="h-8 w-8" />
          {mode === "create" ? "Create New Photo" : "Edit Photo"}
        </h2>
        <p className="mt-1 text-sm text-white/80">
          {mode === "edit"
            ? "Update the photo's information below."
            : "Fill in the photo's information below."}
        </p>
      </div>

      {/* Form content section */}
      <div className="p-6">
        <p className="text-xs mb-6">
          Fields marked with an asterisk (*) are required
        </p>
        <PhotoForm
          articles={articles}
          image={image}
          isSubmitting={isSubmitting}
          uploadProgress={uploadProgress}
          isImageProcessing={isImageProcessing}
          previewUrl={previewUrl}
          formValues={formValues}
          isFormEmpty={isFormEmpty}
          isImageAvailable={isImageAvailable}
          onInputChange={handleInputChange}
          onFileChange={handleFileChange}
          onClearFile={handleClearFile}
          onSubmit={handleSubmit}
        />
      </div>

      {previousImageUrl && !isCleanupComplete && (
        <ImageCleanupHandler
          previousImageUrl={previousImageUrl}
          onCleanupComplete={handleCleanupComplete}
        />
      )}
    </div>
  );
}
