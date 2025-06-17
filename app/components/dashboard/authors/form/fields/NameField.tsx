import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { AuthorFormData } from "../authorSchema";

interface NameFieldProps {
  register: UseFormRegister<AuthorFormData>;
  errors: FieldErrors<AuthorFormData>;
}

export function NameField({ register, errors }: NameFieldProps) {
  return (
    <div>
      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
        Name <span className="text-xs">(*)</span>
      </label>
      <input
        type="text"
        id="name"
        {...register("name")}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border px-3 py-2 text-sm"
        placeholder="Enter author's name"
      />
      {errors.name && (
        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
      )}
    </div>
  );
}
