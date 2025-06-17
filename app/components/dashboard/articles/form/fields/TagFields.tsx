"use client";

import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { ArticleFormData } from "../articleSchema";
import { Tag } from "../../../../../lib/definition";

interface TagFieldsProps {
  register: UseFormRegister<ArticleFormData>;
  errors: FieldErrors<ArticleFormData>;
  tags: Tag[];
  selectedTags: number[];
  onTagChange: () => void;
}

export default function TagFields({
  register,
  errors,
  tags,
  selectedTags,
  onTagChange,
}: TagFieldsProps) {
  const { onChange: registerOnChange, ...registerRest } = register("tag_ids");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    registerOnChange(e);
    onTagChange();
  };

  return (
    <div className="space-y-2">
      <label htmlFor="tag_ids" className="block text-sm font-medium">
        Tags <span className="text-xs">(*)</span>
      </label>
      <select
        id="tag_ids"
        multiple
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm border px-3 py-2 [&>option:checked]:bg-gray-200 [&>option:checked]:text-black  "
        value={selectedTags.map(String)}
        onChange={handleChange}
        {...registerRest}
      >
        {tags.map((tag) => (
          <option
            key={tag.id}
            value={tag.id}
            className={`py-2 px-2 rounded-md mt-1 ${selectedTags.includes(tag.id)
              ? "bg-gray-200"
              : "hover:bg-blue-500 hover:text-white"
              }`}
            style={{
              backgroundColor: selectedTags.includes(tag.id)
                ? "#e5e7eb"
                : "#ffffff",
              color: selectedTags.includes(tag.id) ? "#000000" : "#000000",
            }}
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
