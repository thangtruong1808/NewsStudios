"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { UserFormValues } from "../userSchema";

interface NameFieldsProps {
  register: UseFormRegister<UserFormValues>;
  errors: FieldErrors<UserFormValues>;
}

export default function NameFields({ register, errors }: NameFieldsProps) {
  return (
    <>
      <div>
        <label
          htmlFor="firstname"
          className="block text-sm font-medium text-gray-700"
        >
          First Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="firstname"
          {...register("firstname")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border px-3 py-2"
        />
        {errors.firstname && (
          <p className="mt-1 text-sm text-red-600">
            {errors.firstname.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="lastname"
          className="block text-sm font-medium text-gray-700"
        >
          Last Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="lastname"
          {...register("lastname")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border px-3 py-2"
        />
        {errors.lastname && (
          <p className="mt-1 text-sm text-red-600">{errors.lastname.message}</p>
        )}
      </div>
    </>
  );
}
