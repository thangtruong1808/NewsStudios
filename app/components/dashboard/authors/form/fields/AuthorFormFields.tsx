import { UseFormRegister, FieldErrors, Control } from "react-hook-form";
import { AuthorFormData } from "../authorSchema";
import { NameField } from "./NameField";
import { DescriptionField } from "./DescriptionField";
import BioField from "./BioField";

interface AuthorFormFieldsProps {
  register: UseFormRegister<AuthorFormData>;
  errors: FieldErrors<AuthorFormData>;
  control: Control<AuthorFormData>;
  isEditMode: boolean;
}

export function AuthorFormFields({
  register,
  errors,
  control,
  isEditMode,
}: AuthorFormFieldsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <NameField register={register} errors={errors} />
        <DescriptionField register={register} errors={errors} />
        <BioField register={register} errors={errors} />
      </div>
    </div>
  );
}
