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

interface UserFormProps {
  user?: User;
  isEditMode?: boolean;
}

export default function UserForm({ user, isEditMode = false }: UserFormProps) {
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
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
  });

  console.log("UserForm - Current Session:", session);
  console.log("UserForm - Editing User:", user);

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
          toast.success("User updated successfully");
          router.push("/dashboard/users");
          router.refresh();
        } else {
          console.log("Failed to update user");
          toast.error("Failed to update user");
        }
      } else {
        console.log("Creating new user");
        const success = await createUser(data);
        if (success) {
          console.log("User created successfully");
          toast.success("User created successfully");
          router.push("/dashboard/users");
          router.refresh();
        } else {
          console.log("Failed to create user");
          toast.error("Failed to create user");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred while submitting the form");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600">
        <h2 className="text-xl font-semibold text-white">
          {isEditMode
            ? `Edit User: ${user?.firstname} ${user?.lastname}`
            : "Create New User"}
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        <p className="text-sm text-gray-500">
          Fields marked with an asterisk (*) are required
        </p>

        <UserFormFields
          register={register}
          errors={errors}
          isEditMode={isEditMode}
          control={control}
          userId={user?.id}
        />

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
