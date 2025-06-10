import { UseFormRegister, FieldErrors } from "react-hook-form";
import { AuthorFormData } from "../authorSchema";

interface BioFieldProps {
  register: UseFormRegister<AuthorFormData>;
  errors: FieldErrors<AuthorFormData>;
}

export function BioField({ register, errors }: BioFieldProps) {
  return (
    <div>
      <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
        Bio <span className="text-xs">(optional)</span>
      </label>
      <textarea
        id="bio"
        rows={8}
        {...register("bio")}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border px-3 py-2 text-sm"
        placeholder="Enter the author's biography"
      />
      {errors.bio && (
        <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
      )}
    </div>
  );
}
