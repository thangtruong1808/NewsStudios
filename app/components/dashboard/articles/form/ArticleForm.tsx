"use client";

import { useRouter } from "next/navigation";
import {
  User,
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

interface ArticleFormProps {
  article?: Partial<Article>;
  categories: CategoryType[];
  authors: AuthorType[];
  subcategories: SubCategory[];
  users: User[];
  tags: Tag[];
}

export default function ArticleForm({
  article,
  categories = [],
  authors = [],
  subcategories = [],
  users = [],
  tags = [],
}: ArticleFormProps) {
  const router = useRouter();
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
    imageUrl,
    videoUrl,
    uploadProgress,
    handleTagChange,
    handleFileUpload,
    handleCategoryChange,
    onSubmit,
  } = useArticleForm({
    article,
    categories,
    authors,
    subcategories,
    users,
    tags,
  });

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <FormHeader isEdit={!!article} />

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        <p className="text-sm text-gray-500">
          Fields marked with an asterisk (*) are required
        </p>

        <FormTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="grid grid-cols-1 gap-6">
          {activeTab === "basic" && (
            <>
              <BasicFields
                register={register}
                errors={errors}
                control={control}
                categories={categories}
                authors={authors}
                users={users}
                subcategories={subcategories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                filteredSubcategories={filteredSubcategories}
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

          {activeTab === "content" && (
            <ContentFields register={register} errors={errors} />
          )}

          {activeTab === "media" && (
            <MediaFields
              register={register}
              errors={errors}
              imageUrl={imageUrl}
              videoUrl={videoUrl}
              uploadProgress={uploadProgress}
              onFileUpload={handleFileUpload}
            />
          )}

          {activeTab === "settings" && (
            <SettingsFields register={register} errors={errors} />
          )}
        </div>

        <FormActions
          isSubmitting={isSubmitting}
          onCancel={() => router.push("/dashboard/articles")}
        />
      </form>
    </div>
  );
}
