"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { UserFormValues } from "../userSchema";
import { uploadToCloudinary } from "../../../../../lib/utils/cloudinaryUtils";
import toast from "react-hot-toast";

interface ImageFieldProps {
  register: UseFormRegister<UserFormValues>;
  errors: FieldErrors<UserFormValues>;
  userImage: string;
  setImagePreview: (url: string | null) => void;
}

export default function ImageField({
  register,
  errors,
  userImage,
  setImagePreview,
}: ImageFieldProps) {
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Create a preview URL for immediate display
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

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
      const result = await uploadToCloudinary(file, "image");

      if (!result.success || !result.url) {
        toast.error(`Failed to upload image: ${result.error}`);
        setImagePreview(null);
        return;
      }

      // Update the form value
      const { onChange } = register("user_image");
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
    }
  };

  return (
    <div className="col-span-full">
      <label
        htmlFor="user_image"
        className="block text-sm font-medium text-gray-900"
      >
        Profile Image
      </label>
      <div className="mt-2">
        <input
          type="file"
          id="user_image"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
        />
      </div>
      {userImage && (
        <div className="mt-2">
          <p className="text-sm font-medium text-gray-700">Preview:</p>
          <div className="mt-1 relative h-48 w-48 overflow-hidden rounded-md">
            <img
              src={userImage}
              alt="Preview"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      )}
      {errors.user_image && (
        <p className="mt-2 text-sm text-red-600">{errors.user_image.message}</p>
      )}
    </div>
  );
}
