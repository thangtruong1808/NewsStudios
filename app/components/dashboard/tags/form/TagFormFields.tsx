"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { TagFormValues } from "../../types";
import { NameField, DescriptionField, ColorField } from "./fields";

interface TagFormFieldsProps {
  register: UseFormRegister<TagFormValues>;
  errors: FieldErrors<TagFormValues>;
}

export default function TagFormFields({
  register,
  errors,
}: TagFormFieldsProps) {
  return (
    <div className="space-y-6">
      <NameField register={register} errors={errors} />
      <DescriptionField register={register} errors={errors} />
      <ColorField register={register} errors={errors} />
    </div>
  );
}
