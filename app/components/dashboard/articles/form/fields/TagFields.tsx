"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ArticleFormData } from "../articleSchema";
import { Tag } from "../../../../../lib/definition";

interface TagFieldsProps {
  register: UseFormRegister<ArticleFormData>;
  errors: FieldErrors<ArticleFormData>;
  tags: Tag[];
  selectedTags: number[];
  onTagChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function TagFields({
  register,
  errors,
  tags,
  selectedTags,
  onTagChange,
}: TagFieldsProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="tag_ids" className="block text-sm font-medium">
        Tags <span className="text-red-500">*</span>
      </label>
      <select
        id="tag_ids"
        multiple
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-xs border px-3 py-2"
        onChange={onTagChange}
        value={Array.isArray(selectedTags) ? selectedTags.map(String) : []}
      >
        {tags.map((tag) => (
          <option
            key={tag.id}
            value={tag.id}
            className={`py-2 hover:bg-blue-100 ${
              selectedTags.includes(tag.id) ? "bg-blue-100 rounded-md " : ""
            }`}
          >
            {tag.name}
          </option>
        ))}
      </select>
      <p className="text-xs mt-2">
        Hold Ctrl (Windows) or Command (Mac) to select multiple tags
      </p>
      {errors.tag_ids && (
        <p className="text-sm text-red-600">{errors.tag_ids.message}</p>
      )}
    </div>
  );
}
