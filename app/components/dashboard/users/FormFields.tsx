"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { UserFormData } from "../../../lib/validations/userSchema";

interface FormFieldsProps {
  register: UseFormRegister<UserFormData>;
  errors: FieldErrors<UserFormData>;
  userId?: string;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
}

export default function FormFields({
  register,
  errors,
  userId,
  showPassword,
  setShowPassword,
}: FormFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="firstname"
          className="block text-sm font-medium text-gray-700"
        >
          First Name
        </label>
        <input
          id="firstname"
          {...register("firstname")}
          type="text"
          className={`mt-1 appearance-none block w-full px-3 py-2 border ${
            errors.firstname ? "border-red-300" : "border-gray-300"
          } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm`}
          placeholder="First Name"
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
          Last Name
        </label>
        <input
          id="lastname"
          {...register("lastname")}
          type="text"
          className={`mt-1 appearance-none block w-full px-3 py-2 border ${
            errors.lastname ? "border-red-300" : "border-gray-300"
          } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm`}
          placeholder="Last Name"
        />
        {errors.lastname && (
          <p className="mt-1 text-sm text-red-600">{errors.lastname.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email address
        </label>
        <input
          id="email"
          {...register("email")}
          type="email"
          className={`mt-1 appearance-none block w-full px-3 py-2 border ${
            errors.email ? "border-red-300" : "border-gray-300"
          } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm`}
          placeholder="Email address"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div className="relative">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          id="password"
          {...register("password")}
          type={showPassword ? "text" : "password"}
          className={`mt-1 appearance-none block w-full px-3 py-2 border ${
            errors.password ? "border-red-300" : "border-gray-300"
          } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm`}
          placeholder={
            userId ? "Current Password (click to change)" : "Password"
          }
        />
        {userId && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 top-8 pr-3 flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        )}
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="role"
          className="block text-sm font-medium text-gray-700"
        >
          Role
        </label>
        <select
          id="role"
          {...register("role")}
          className={`mt-1 appearance-none block w-full px-3 py-2 border ${
            errors.role ? "border-red-300" : "border-gray-300"
          } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm`}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
        </select>
        {errors.role && (
          <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700"
        >
          Status
        </label>
        <select
          id="status"
          {...register("status")}
          className={`mt-1 appearance-none block w-full px-3 py-2 border ${
            errors.status ? "border-red-300" : "border-gray-300"
          } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm`}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        {errors.status && (
          <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          {...register("description")}
          rows={3}
          className={`mt-1 appearance-none block w-full px-3 py-2 border ${
            errors.description ? "border-red-300" : "border-gray-300"
          } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm`}
          placeholder="Description (optional)"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>
    </div>
  );
}
