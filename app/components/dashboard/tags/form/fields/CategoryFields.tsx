"use client";

import { useEffect, useState } from "react";
import {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { TagFormValues } from "../../types";
import { getCategories } from "@/app/lib/actions/categories";
import { getSubcategories } from "@/app/lib/actions/subcategories";

interface CategoryFieldsProps {
  register: UseFormRegister<TagFormValues>;
  errors: FieldErrors<TagFormValues>;
  setValue: UseFormSetValue<TagFormValues>;
  watch: UseFormWatch<TagFormValues>;
  isEditMode?: boolean;
}

export function CategoryFields({
  register,
  errors,
  setValue,
  watch,
  isEditMode = false,
}: CategoryFieldsProps) {
  const [categories, setCategories] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [subcategories, setSubcategories] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSubcategories, setIsLoadingSubcategories] = useState(false);

  const selectedCategoryId = watch("category_id");

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await getCategories({ page: 1, limit: 100 });
        if (result.data) {
          setCategories(result.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch subcategories when category changes or on initial load
  useEffect(() => {
    const fetchSubcategories = async () => {
      // Don't reset subcategory on initial load if we have a category_id
      if (!selectedCategoryId && !watch("sub_category_id")) {
        setValue("sub_category_id", 0);
        setSubcategories([]);
        return;
      }

      setIsLoadingSubcategories(true);
      try {
        const result = await getSubcategories({
          page: 1,
          limit: 100,
          categoryId: selectedCategoryId,
        });
        if (result.data) {
          setSubcategories(result.data);
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      } finally {
        setIsLoadingSubcategories(false);
      }
    };

    fetchSubcategories();
  }, [selectedCategoryId, setValue, watch]);

  // Handle category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : 0;
    setValue("category_id", value);
    // Only reset subcategory if we're changing the category
    if (value !== selectedCategoryId) {
      setValue("sub_category_id", 0);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Category Select */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Category <span className="text-xs">(*)</span>
        </label>
        <select
          id="category_id"
          {...register("category_id", {
            valueAsNumber: true,
            onChange: handleCategoryChange,
          })}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2 text-sm ${
            errors.category_id ? "border-red-500" : ""
          } ${isEditMode ? "bg-gray-100 cursor-not-allowed" : ""}`}
          disabled={isLoading || isEditMode}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.category_id && (
          <p className="mt-1 text-sm text-red-600">
            {errors.category_id.message}
          </p>
        )}
      </div>

      {/* SubCategory Select */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          SubCategory <span className="text-xs">(*)</span>
        </label>
        <select
          id="sub_category_id"
          {...register("sub_category_id", {
            valueAsNumber: true,
            validate: (value) => {
              if (!selectedCategoryId) {
                return "Please select a category first";
              }
              return value > 0 || "SubCategory is required";
            },
          })}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2 text-sm ${
            errors.sub_category_id ? "border-red-500" : ""
          }`}
          disabled={isLoadingSubcategories || !selectedCategoryId}
        >
          <option value="">Select a subcategory</option>
          {subcategories.map((subcategory) => (
            <option key={subcategory.id} value={subcategory.id}>
              {subcategory.name}
            </option>
          ))}
        </select>
        {errors.sub_category_id && (
          <p className="mt-1 text-sm text-red-600">
            {errors.sub_category_id.message}
          </p>
        )}
        {!selectedCategoryId && !errors.sub_category_id && (
          <p className="mt-1 text-sm text-gray-500">
            Please select a category first
          </p>
        )}
      </div>
    </div>
  );
}
