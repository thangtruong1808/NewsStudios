"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Category as CategoryType,
  Author as AuthorType,
  SubCategory,
  Tag,
  Article,
} from "../../../../lib/definition";
import {
  BasicFields,
  ContentFields,
  MediaFields,
  SettingsFields,
  TagFields,
} from "./fields";
import { FormHeader, FormTabs, FormActions } from ".";
import { useArticleForm } from "./hooks/useArticleForm";
import type { ArticleFormData } from "./articleSchema";
import { showErrorToast } from "@/app/components/dashboard/shared/toast/Toast";

// Props interface defining the required data for the form
interface ArticleFormProps {
  article?: Partial<Article>;
  categories: CategoryType[];
  authors: AuthorType[];
  subcategories: SubCategory[];
  tags: Tag[];
}

// Component Info
// Description: Article creation and edit form with tabbed sections for content, media, and settings.
// Date updated: 2025-November-21
// Author: thangtruong
export default function ArticleForm({
  article,
  categories = [],
  authors = [],
  subcategories = [],
  tags: initialTags = [],
}: ArticleFormProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id ? Number(session.user.id) : undefined;

  // Custom hook that manages all form logic and state
  const {
    register,
    handleSubmit,
    formState,
    isSubmitting,
    activeTab,
    setActiveTab,
    selectedCategory,
    selectedTags,
    filteredSubcategories,
    tags,
    imageUrl,
    videoUrl,
    handleTagChange,
    handleFileUpload,
    handleCategoryChange,
    handleRemoveMedia,
    onSubmit,
    isFormEmpty,
    isEditMode,
  } = useArticleForm({
    article,
    subcategories,
    tags: initialTags,
    userId,
  });

  const onValid = (data: ArticleFormData) => onSubmit(data);

  const onInvalid = () => {
    showErrorToast({ message: "Please review the highlighted errors and try again." });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Form header with title and description */}
      <FormHeader isEdit={!!article} />

      <form
        onSubmit={handleSubmit(onValid, onInvalid)}
        className="p-6 space-y-6"
      >
        <p className="text-xs ">
          Fields marked with an asterisk (*) are required
        </p>

        {/* Tab navigation for form sections */}
        <FormTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="grid grid-cols-1 gap-6">
          {/* Basic Information Tab */}
          {activeTab === "basic" && (
            <>
              <BasicFields
                register={register}
                errors={formState.errors}
                categories={categories}
                authors={authors}
                filteredSubcategories={filteredSubcategories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
              />
              <TagFields
                register={register}
                errors={formState.errors}
                tags={tags}
                selectedTags={selectedTags}
                onTagChange={handleTagChange}
              />
            </>
          )}

          {/* Content Tab */}
          {activeTab === "content" && (
            <ContentFields register={register} errors={formState.errors} />
          )}

          {/* Media Tab */}
          {activeTab === "media" && (
            <MediaFields
              register={register}
              imageUrl={imageUrl}
              videoUrl={videoUrl}
              onFileUpload={handleFileUpload}
              onRemoveMedia={handleRemoveMedia}
            />
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <SettingsFields
              register={register}
            />
          )}
        </div>

        {/* Form action buttons with conditional rendering */}
        <FormActions
          isSubmitting={isSubmitting}
          isFormEmpty={isFormEmpty}
          isEditMode={isEditMode}
          onCancel={() => router.push("/dashboard/articles")}
        />
      </form>
    </div>
  );
}
