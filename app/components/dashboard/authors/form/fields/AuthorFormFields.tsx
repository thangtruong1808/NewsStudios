import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { AuthorFormData } from "../authorSchema";
import { NameField, DescriptionField, BioField } from ".";

interface AuthorFormFieldsProps {
  register: UseFormRegister<AuthorFormData>;
  errors: FieldErrors<AuthorFormData>;
}

// Description: Compose author form fields including name, description, and bio inputs.
// Data created: 2024-11-13
// Author: thangtruong
export function AuthorFormFields({
  register,
  errors,
}: AuthorFormFieldsProps) {
  return (
    <div className="space-y-6">
      {/* Author detail fields */}
      <div className="grid grid-cols-1 gap-6">
        <NameField register={register} errors={errors} />
        <DescriptionField register={register} errors={errors} />
        <BioField register={register} errors={errors} />
      </div>
    </div>
  );
}
