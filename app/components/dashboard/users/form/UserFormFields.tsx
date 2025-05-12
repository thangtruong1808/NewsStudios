"use client";

import {
  UseFormRegister,
  FieldErrors,
  useWatch,
  Control,
} from "react-hook-form";
import { UserFormValues } from "./userSchema";
import { useState, useEffect } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { uploadToCloudinary } from "../../../../lib/utils/cloudinaryUtils";
import toast from "react-hot-toast";

interface UserFormFieldsProps {
  register: UseFormRegister<UserFormValues>;
  errors: FieldErrors<UserFormValues>;
  isEditMode: boolean;
  control: Control<UserFormValues>;
}

export default function UserFormFields({
  register,
  errors,
  isEditMode,
  control,
}: UserFormFieldsProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Watch the user_image field for changes
  const userImage = useWatch({
    control,
    name: "user_image",
  });

  // Log initial mount and userImage changes
  useEffect(() => {
    console.log("UserFormFields - Component mounted");
    console.log("UserFormFields - Initial userImage value:", userImage);
  }, []);

  // Update image preview when user_image changes
  useEffect(() => {
    console.log("UserFormFields - user_image field changed:", userImage);
    if (userImage) {
      console.log("UserFormFields - Setting image preview to:", userImage);
      setImagePreview(userImage);
    }
  }, [userImage]);

  // Log form state changes
  useEffect(() => {
    console.log("UserFormFields - Current image preview:", imagePreview);
  }, [imagePreview]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Create a preview URL for immediate display
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      console.log("UserFormFields - Created preview URL:", previewUrl);

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        setImagePreview(null);
        return;
      }

      // Validate file size (limit to 500MB)
      if (file.size > 500 * 1024 * 1024) {
        toast.error("Image file size must be less than 500MB");
        setImagePreview(null);
        return;
      }

      // Upload to Cloudinary
      console.log("UserFormFields - Uploading to Cloudinary...");
      const result = await uploadToCloudinary(file, "image");
      console.log("UserFormFields - Cloudinary upload result:", result);

      if (!result.success || !result.url) {
        toast.error(`Failed to upload image: ${result.error}`);
        setImagePreview(null);
        return;
      }

      // Update the form value
      const { onChange } = register("user_image");
      console.log("UserFormFields - Updating form with image URL:", result.url);
      onChange({
        target: {
          name: "user_image",
          value: result.url,
        },
      });

      // Update preview with the Cloudinary URL
      setImagePreview(result.url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
      setImagePreview(null);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <label
            htmlFor="user_image"
            className="block text-sm font-medium text-gray-700"
          >
            Profile Image
            <span className="text-sm text-gray-400 ml-1"> (optional)</span>
          </label>
          <div className="mt-1 flex items-center gap-4">
            <div className="relative">
              {imagePreview ? (
                <div className="relative group">
                  <img
                    src={imagePreview}
                    alt="Profile preview"
                    className="h-20 w-20 rounded-full object-cover border-2 border-indigo-100"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs">Preview</span>
                  </div>
                </div>
              ) : (
                <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                  <span className="text-gray-400 text-xs">No image</span>
                </div>
              )}
            </div>
            <input
              type="file"
              id="user_image"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            {isUploading && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Uploading: {uploadProgress}%
                </p>
              </div>
            )}
            {errors.user_image && (
              <p className="mt-1 text-sm text-red-600">
                {errors.user_image.message}
              </p>
            )}
          </div>
        </div>

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
            <p className="mt-1 text-sm text-red-600">
              {errors.lastname.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            {...register("email")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border px-3 py-2"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password{" "}
            {isEditMode ? (
              <span className="text-gray-500">
                (leave blank to keep current)
              </span>
            ) : (
              <span className="text-red-500">*</span>
            )}
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              {...register("password")}
              placeholder={
                isEditMode ? "Enter new password to change" : "Password"
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border px-3 py-2"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
              ) : (
                <EyeIcon className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700"
          >
            Role <span className="text-red-500">*</span>
          </label>
          <select
            id="role"
            {...register("role")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border px-3 py-2"
          >
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="user">User</option>
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
            Status <span className="text-red-500">*</span>
          </label>
          <select
            id="status"
            {...register("status")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border px-3 py-2"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description <span className="text-sm text-gray-400">(optional)</span>
        </label>
        <textarea
          id="description"
          rows={3}
          {...register("description")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border px-3 py-2"
          placeholder="Enter a description for this user"
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
