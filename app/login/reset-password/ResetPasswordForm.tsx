"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";
import FormInput from "./components/FormInput";
import PasswordInput from "./components/PasswordInput";
import SubmitButton from "./components/SubmitButton";
import { resetPasswordSchema, ResetPasswordFormData } from "./schema";

export default function ResetPasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to reset password");
      }

      toast.success(
        "Password reset successful! Please login with your new password."
      );
      router.push("/login");
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred during password reset"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          id="email"
          type="email"
          label="Email"
          error={errors.email?.message}
          {...register("email")}
          placeholder="your.email@example.com"
        />

        <PasswordInput
          id="password"
          label="New Password"
          error={errors.password?.message}
          {...register("password")}
          placeholder="••••••••"
        />

        <PasswordInput
          id="confirmPassword"
          label="Confirm New Password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
          placeholder="••••••••"
        />

        <SubmitButton isLoading={isSubmitting}>
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </SubmitButton>

        <div className="text-center">
          <Link
            href="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
}
