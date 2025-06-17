/**
 * ArticleForm Component
 * A comprehensive form for creating and editing articles with the following features:
 * - Tabbed interface for organizing form fields (Basic, Content, Media, Settings)
 * - Form validation using react-hook-form and zod schema
 * - Real-time validation and error handling
 * - File upload handling for images and videos
 * - Dynamic subcategory filtering based on selected category
 * - Tag management with multi-select functionality
 * - Responsive layout with consistent styling
 */

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

// Props interface defining the required data for the form
interface ArticleFormProps {
  article?: Partial<Article>;
  categories: CategoryType[];
  authors: AuthorType[];
  subcategories: SubCategory[];
  tags: Tag[];
}

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
    errors,
    control,
    isSubmitting,
    activeTab,
    setActiveTab,
    selectedCategory,
    selectedTags,
    filteredSubcategories,
    tags,
    imageUrl,
    videoUrl,
    uploadProgress,
    handleTagChange,
    handleFileUpload,
    handleCategoryChange,
    handleRemoveMedia,
    onSubmit,
    isFormEmpty,
    isEditMode,
  } = useArticleForm({
    article,
    categories,
    authors,
    subcategories,
    tags: initialTags,
    userId,
  });

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Form header with title and description */}
      <FormHeader isEdit={!!article} />

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
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
                errors={errors}
                control={control}
                categories={categories}
                authors={authors}
                filteredSubcategories={subcategories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
              />
              <TagFields
                register={register}
                errors={errors}
                tags={tags}
                selectedTags={selectedTags}
                onTagChange={handleTagChange}
              />
            </>
          )}

          {/* Content Tab */}
          {activeTab === "content" && (
            <ContentFields register={register} errors={errors} />
          )}

          {/* Media Tab */}
          {activeTab === "media" && (
            <MediaFields
              register={register}
              errors={errors}
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
