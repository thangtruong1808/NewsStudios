"use client";

import type {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { TagFormValues } from "../types";
import { NameField, DescriptionField, ColorField } from "./fields";
import { CategoryFields } from "./fields/CategoryFields";

/* eslint-disable no-unused-vars */
interface TagFormFieldsProps {
  register: UseFormRegister<TagFormValues>;
  errors: FieldErrors<TagFormValues>;
  setValue: UseFormSetValue<TagFormValues>;
  watch: UseFormWatch<TagFormValues>;
  isEditMode?: boolean;
}
/* eslint-enable no-unused-vars */

// Description: Compose individual tag form sections including category linkage and metadata fields.
// Data created: 2024-11-13
// Author: thangtruong

export default function TagFormFields({
  register,
  errors,
  setValue,
  watch,
  isEditMode = false,
}: TagFormFieldsProps) {
  return (
    <div className="space-y-6">
      <CategoryFields
        register={register}
        errors={errors}
        setValue={setValue}
        watch={watch}
        isEditMode={isEditMode}
      />
      <NameField register={register} errors={errors} />
      <DescriptionField register={register} errors={errors} />
      <ColorField register={register} errors={errors} setValue={setValue} />
    </div>
  );
}
