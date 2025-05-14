import { UseFormRegister, FieldErrors } from "react-hook-form";
import { AuthorFormData } from "../authorSchema";

interface NameFieldProps {
  register: UseFormRegister<AuthorFormData>;
  errors: FieldErrors<AuthorFormData>;
}

export function NameField({ register, errors }: NameFieldProps) {
  return (
    <div>
      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
        Name <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        id="name"
        {...register("name")}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm px-4 py-2.5"
        placeholder="Enter author's name"
      />
      {errors.name && (
        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
      )}
    </div>
  );
}
