"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserFormValues, createUserSchema, editUserSchema } from "./userSchema";
import { User } from "../../../../lib/definition";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { createUser, updateUser } from "../../../../lib/actions/users";
import UserFormFields from "./UserFormFields";
import { useSession } from "next-auth/react";
import {
  showSuccessToast,
  showErrorToast,
} from "../../../dashboard/shared/toast/Toast";

/**
 * Props interface for the UserForm component
 */
interface UserFormProps {
  user?: User; // Optional user data for edit mode
  isEditMode?: boolean; // Flag to determine if form is in edit mode
}

/**
 * UserForm Component
 * A form component for creating and editing users with validation and error handling.
 * Supports both create and edit modes with different validation schemas.
 */
export default function UserForm({ user, isEditMode = false }: UserFormProps) {
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();

  // Initialize form with react-hook-form and zod validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty },
    control,
  } = useForm<UserFormValues>({
    resolver: zodResolver(isEditMode ? editUserSchema : createUserSchema),
    defaultValues: {
      firstname: user?.firstname || "",
      lastname: user?.lastname || "",
      email: user?.email || "",
      password: "",
      role: user?.role || "user",
      status: user?.status || "active",
      description: user?.description || "",
      user_image: user?.user_image || "",
    },
    mode: "onChange", // Enable real-time validation
  });

  console.log("UserForm - Current Session:", session);
  console.log("UserForm - Editing User:", user);

  /**
   * Form submission handler
   * Processes form data for both create and edit modes
   * Updates session and redirects on success
   */
  const onSubmit = async (data: UserFormValues) => {
    try {
      console.log("Submitting form data:", data);

      if (isEditMode && user) {
        console.log("Updating existing user:", user.id);
        const success = await updateUser(user.id, data);
        if (success) {
          console.log("User updated successfully, updating session");
          // Update the session to reflect the changes
          await updateSession();
          console.log("Session updated");
          showSuccessToast({ message: "User updated successfully" });
          router.push("/dashboard/users");
          router.refresh();
        } else {
          console.log("Failed to update user");
          showErrorToast({ message: "Failed to update user" });
        }
      } else {
        console.log("Creating new user");
        const success = await createUser(data);
        if (success) {
          console.log("User created successfully");
          showSuccessToast({ message: "User created successfully" });
          router.push("/dashboard/users");
          router.refresh();
        } else {
          console.log("Failed to create user");
          showErrorToast({ message: "Failed to create user" });
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      showErrorToast({
        message: "An error occurred while submitting the form",
      });
    }
  };

  // Determine if the submit button should be disabled
  const isSubmitDisabled =
    isSubmitting || !isValid || (!isDirty && !isEditMode);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Form header with gradient background */}
      <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-400">
        <h2 className="text-xl font-semibold text-white">
          {isEditMode
            ? `Edit User: ${user?.firstname} ${user?.lastname}`
            : "Create New User"}
        </h2>
      </div>

      {/* Main form content */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        <p className="text-xs text-gray-500">
          Fields marked with an asterisk (*) are required
        </p>

        {/* Form fields component with validation */}
        <UserFormFields
          register={register}
          errors={errors}
          isEditMode={isEditMode}
          control={control}
          userId={user?.id}
        />

        {/* Form action buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-400 border border-transparent rounded-md shadow-sm hover:from-blue-700 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? "Saving..."
              : isEditMode
              ? "Update User"
              : "Create User"}
          </button>
        </div>
      </form>
    </div>
  );
}
