"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserFormValues, userSchema } from "./userSchema";
import UserFormFields from "./UserFormFields";
import UserFormActions from "./UserFormActions";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUser, updateUser } from "../../../../lib/actions/users";
import toast from "react-hot-toast";

interface UserFormProps {
  user?: {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    password?: string;
    role: "user" | "admin" | "editor";
    status: "active" | "inactive";
    user_image?: string;
    description?: string;
  };
}

export default function UserForm({ user }: UserFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstname: user?.firstname || "",
      lastname: user?.lastname || "",
      email: user?.email || "",
      password: "",
      role: user?.role || "user",
      status: user?.status || "active",
      user_image: user?.user_image || "",
      description: user?.description || "",
    },
  });

  const onSubmit = async (data: UserFormValues) => {
    setIsSubmitting(true);
    try {
      if (user?.id) {
        await updateUser(user.id, data);
        toast.success("User updated successfully");
      } else {
        await createUser(data);
        toast.success("User created successfully");
      }
      router.push("/dashboard/users");
      router.refresh();
    } catch (error) {
      console.error("Error submitting user:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to submit user"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600">
        <h2 className="text-xl font-semibold text-white">
          {user
            ? `Edit User: ${user.firstname} ${user.lastname}`
            : "Create New User"}
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        <UserFormFields
          register={register}
          errors={errors}
          isEditMode={!!user}
          control={control}
        />

        <UserFormActions
          isSubmitting={isSubmitting}
          isEditMode={!!user}
          isLoading={isLoading}
        />
      </form>
    </div>
  );
}
