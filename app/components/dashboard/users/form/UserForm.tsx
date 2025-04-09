"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { User } from "../../../../type/definitions";
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

interface UserFormProps {
  userId?: string;
}

export default function UserForm({ userId }: UserFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(!!userId);
  const [userData, setUserData] = useState<User | undefined>(undefined);
  const isEditMode = !!userId;

  const {
    register,
    handleSubmit,
    reset,
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
            console.error("Error fetching user:", error);
            setError(error);
            return;
          }

          if (user) {
            console.log("User data loaded:", user);
            reset({
              firstname: user.firstname,
              lastname: user.lastname,
              email: user.email,
              password: "********",
              role: user.role,
              status: user.status,
              description: user.description || "",
            });
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
  }, [userId, reset]);

  const onSubmit = async (data: UserFormValues) => {
    try {
      setIsLoading(true);
      setError(null);

      if (userId) {
        const updateData = { ...data };
        if (!updateData.password || updateData.password === "********") {
          delete updateData.password;
        }

        try {
          const result = await updateUser(parseInt(userId), updateData);
          if (result.success) {
            toast.success("User updated successfully");
            router.push("/dashboard/users");
          }
        } catch (error) {
          console.error("Error updating user:", error);
          toast.error(
            error instanceof Error ? error.message : "Failed to update user"
          );
          return;
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <UserFormFields
        register={register}
        errors={errors}
        isEditMode={isEditMode}
      />

      <UserFormActions
        isLoading={isLoading}
        isSubmitting={isSubmitting}
        isEditMode={isEditMode}
      />
    </form>
  );
}
