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
import { resetPassword } from "../actions/reset-password";

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
      const result = await resetPassword(data);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Password reset successful");
      router.push("/login");
    } catch (error) {
      toast.error("An error occurred while resetting your password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
  );
}
