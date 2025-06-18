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
  console.log('rendered');
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id ? Number(session.user.id) : undefined;

  // Custom hook that manages all form logic and state
  const {
    register,
    handleSubmit,
    control,
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
    uploadProgress,
    handleTagChange,
    handleFileUpload,
    handleCategoryChange,
    handleRemoveMedia,
    onSubmit,
    isFormEmpty,
    isEditMode,
    getValues,
  } = useArticleForm({
    article,
    categories,
    authors,
    subcategories,
    tags: initialTags,
    userId,
  });

  // Add a debug log for form submission
  const onValid = (data: any) => {
    console.log('[DEBUG] Form submission started');
    console.log('[DEBUG] Raw form data:', data);

    // Map string values to numbers where needed
    const mappedData = {
      ...data,
      category_id: data.category_id ? Number(data.category_id) : undefined,
      author_id: data.author_id ? Number(data.author_id) : undefined,
      sub_category_id: data.sub_category_id ? Number(data.sub_category_id) : undefined,
      tag_ids: Array.isArray(data.tag_ids) ? data.tag_ids.map(Number) : [],
    };

    console.log('[DEBUG] Mapped form data:', mappedData);
    return onSubmit(mappedData);
  };

  const onInvalid = (errors: any) => {
    console.log('[DEBUG] Form validation failed:', errors);
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
                control={control}
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
              errors={formState.errors}
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
