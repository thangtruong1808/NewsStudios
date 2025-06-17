import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { AuthorFormData } from "../authorSchema";

interface DescriptionFieldProps {
  register: UseFormRegister<AuthorFormData>;
  errors: FieldErrors<AuthorFormData>;
}

export function DescriptionField({ register, errors }: DescriptionFieldProps) {
  return (
    <div>
      <label
        htmlFor="description"
        className="block text-sm font-medium text-gray-700"
      >
        Description <span className="text-xs">(optional)</span>
      </label>
      <textarea
        id="description"
        rows={8}
        {...register("description")}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border px-3 py-2 text-sm"
        placeholder="Enter a brief description of the author"
      />
      {errors.description && (
        <p className="mt-1 text-sm text-red-600">
          {errors.description.message}
        </p>
      )}
    </div>
  );
}
