"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { User } from "../../../../login/login-definitions";
import {
  createUser,
  updateUser,
  getUserById,
} from "../../../../lib/actions/users";
import { userSchema, UserFormValues } from "./userSchema";
import UserFormFields from "./UserFormFields";
import UserFormActions from "./UserFormActions";
import UserFormLoading from "./UserFormLoading";
import UserFormError from "./UserFormError";
import { useUser } from "../../../../context/UserContext";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";

interface UserFormProps {
  userId?: string;
}

export default function UserForm({ userId }: UserFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(!!userId);
  const [userData, setUserData] = useState<User | undefined>(undefined);
  const isEditMode = !!userId;
  const { user: currentUser, setUser } = useUser();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      role: "user",
      status: "active",
      description: "",
      user_image: "",
    },
  });

  // Fetch user data if userId is provided
  useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        try {
          setIsLoading(true);
          console.log("Fetching user with ID:", userId);
          const { data: user, error } = await getUserById(parseInt(userId));

          if (error) {
            console.error("Error fetching user:", error);
            setError(error);
            return;
          }

          if (user) {
            // Ensure we have all the user data including user_image
            const userData: User = {
              id: user.id,
              firstname: user.firstname,
              lastname: user.lastname,
              email: user.email,
              password: user.password,
              role: user.role,
              status: user.status,
              description: user.description || "",
              user_image: user.user_image || "",
              created_at: user.created_at,
              updated_at: user.updated_at,
            };

            console.log("User data loaded:", userData);
            setUserData(userData);

            // Log the user_image value specifically
            console.log("User image URL from database:", userData.user_image);

            // Set form values
            const formData: UserFormValues = {
              firstname: userData.firstname,
              lastname: userData.lastname,
              email: userData.email,
              password: "", // Don't set password for security
              role: userData.role,
              status: userData.status,
              description: userData.description || "",
              user_image: userData.user_image || "", // Ensure user_image is never undefined
            };

            console.log("Setting form data:", formData);

            // Reset the form with all values including user_image
            await reset(formData);

            // Double-check that user_image is set correctly
            if (userData.user_image) {
              console.log("Verifying user_image value:", userData.user_image);
              setValue("user_image", userData.user_image, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
              });
            }
          } else {
            setError("User not found");
          }
        } catch (err) {
          console.error("Exception fetching user:", err);
          setError("Failed to fetch user data");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUser();
  }, [userId, reset, setValue]);

  // Log form state changes
  useEffect(() => {
    if (userData) {
      console.log("UserForm - Current user data:", {
        ...userData,
        user_image: userData.user_image || "No image set",
      });
      console.log("UserForm - Current form values:", register);
    }
  }, [userData, register]);

  const onSubmit = async (data: UserFormValues) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("UserForm - Submitting form data:", data);

      if (userId) {
        console.log("UserForm - Updating user:", userId);
        const updateData = { ...data };
        // Remove password if it's empty
        if (!updateData.password) {
          delete updateData.password;
        }

        try {
          const result = await updateUser(parseInt(userId), updateData);
          console.log("UserForm - Update result:", result);
          if (result.success) {
            // If we're updating the current user, update the context
            if (currentUser && currentUser.id === parseInt(userId)) {
              const updatedUser = {
                ...currentUser,
                ...updateData,
                user_image: updateData.user_image || currentUser.user_image,
              };
              console.log("Updating user context with:", updatedUser);
              setUser(updatedUser);
            }

            toast.success("User updated successfully");
            router.push("/dashboard/users");
            router.refresh();
          } else {
            toast.error(result.error || "Failed to update user");
          }
        } catch (error) {
          console.error("Error updating user:", error);
          toast.error(
            error instanceof Error ? error.message : "Failed to update user"
          );
          return;
        }
      } else {
        console.log("UserForm - Creating new user");
        // Only require password for new users
        if (!data.password) {
          setError("Password is required for new users");
          return;
        }

        try {
          const result = await createUser(
            data as Omit<UserFormValues, "password"> & { password: string }
          );
          console.log("UserForm - Create result:", result);
          if (result.success) {
            toast.success("User created successfully");
            router.push("/dashboard/users");
            router.refresh();
          } else {
            toast.error(result.error || "Failed to create user");
          }
        } catch (error) {
          console.error("Error creating user:", error);
          toast.error(
            error instanceof Error ? error.message : "Failed to create user"
          );
          return;
        }
      }
    } catch (error) {
      console.error("Exception in form submission:", error);
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <UserFormLoading />;
  }

  if (error) {
    return <UserFormError error={error} />;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600">
        <h2 className="text-xl font-semibold text-white">
          {isEditMode ? "Edit User" : "Create New User"}
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        {/* Required Fields Note */}
        <p className="text-sm text-gray-500">
          Fields marked with an asterisk (*) are required
        </p>

        <UserFormFields
          register={register}
          errors={errors}
          isEditMode={isEditMode}
          control={control}
        />

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.push("/dashboard/users")}
            className="inline-flex items-center gap-1 rounded-md border border-zinc-300 bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
          >
            <XMarkIcon className="h-4 w-4" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-1 rounded-md border border-transparent bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 disabled:opacity-50"
          >
            {isSubmitting ? (
              "Processing..."
            ) : (
              <>
                <CheckIcon className="h-4 w-4" />
                {isEditMode ? "Update" : "Submit"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
