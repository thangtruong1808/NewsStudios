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
import { useUser } from "../../../../context/UserContext";
import UserFormFields from "./UserFormFields";
import UserFormLoading from "./UserFormLoading";
import UserFormError from "./UserFormError";
import UserFormActions from "./UserFormActions";

interface UserFormContainerProps {
  userId?: string;
}

export default function UserFormContainer({ userId }: UserFormContainerProps) {
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
          const { data: user, error } = await getUserById(parseInt(userId));

          if (error) {
            setError(error);
            return;
          }

          if (user) {
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

            setUserData(userData);

            const formData: UserFormValues = {
              firstname: userData.firstname,
              lastname: userData.lastname,
              email: userData.email,
              password: "",
              role: userData.role,
              status: userData.status,
              description: userData.description || "",
              user_image: userData.user_image || "",
            };

            await reset(formData);

            if (userData.user_image) {
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
          setError("Failed to fetch user data");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUser();
  }, [userId, reset, setValue]);

  const onSubmit = async (data: UserFormValues) => {
    try {
      setIsLoading(true);
      setError(null);

      if (userId) {
        const updateData = { ...data };
        if (!updateData.password) {
          delete updateData.password;
        }

        try {
          const result = await updateUser(parseInt(userId), updateData);
          if (result.success) {
            if (currentUser && currentUser.id === parseInt(userId)) {
              const updatedUser = {
                ...currentUser,
                ...updateData,
                user_image: updateData.user_image || currentUser.user_image,
              };
              setUser(updatedUser);
            }

            toast.success("User updated successfully");
            router.push("/dashboard/users");
            router.refresh();
          } else {
            toast.error(result.error || "Failed to update user");
          }
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : "Failed to update user"
          );
        }
      } else {
        if (!data.password) {
          setError("Password is required for new users");
          return;
        }

        try {
          const result = await createUser(
            data as Omit<UserFormValues, "password"> & { password: string }
          );
          if (result.success) {
            toast.success("User created successfully");
            router.push("/dashboard/users");
            router.refresh();
          } else {
            toast.error(result.error || "Failed to create user");
          }
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : "Failed to create user"
          );
        }
      }
    } catch (error) {
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
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
      <p className="text-sm text-gray-500">
        Fields marked with an asterisk (*) are required
      </p>

      <UserFormFields
        register={register}
        errors={errors}
        isEditMode={isEditMode}
        control={control}
      />

      <UserFormActions
        isLoading={isLoading}
        isSubmitting={isSubmitting}
        isEditMode={isEditMode}
      />
    </form>
  );
}
