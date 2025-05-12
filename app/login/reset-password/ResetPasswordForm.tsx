"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";
import { AtSymbolIcon, KeyIcon } from "@heroicons/react/24/outline";
import FormInput from "../components/FormInput";
import ErrorMessage from "../components/ErrorMessage";
import SubmitButton from "../components/SubmitButton";
import PasswordToggle from "../components/PasswordToggle";
import { resetPasswordSchema, ResetPasswordFormData } from "./schema";
import { resetPassword } from "../actions/reset-password";

export default function ResetPasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const email = watch("email");
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setIsSubmitting(true);
      setErrorMessage(undefined);
      const result = await resetPassword(data);

      if (result.error) {
        setErrorMessage(result.error);
        return;
      }

      toast.success("Password reset successful");
      router.push("/login");
    } catch (error) {
      setErrorMessage("An error occurred while resetting your password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormInput
            id="email"
            type="email"
            label="Email Address"
            value={email}
            onChange={register("email").onChange}
            name={register("email").name}
            error={errors.email?.message}
            placeholder="you@example.com"
            icon={
              <AtSymbolIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            }
            autoComplete="email"
          />

          <FormInput
            id="password"
            type={showPassword ? "text" : "password"}
            label="New Password"
            value={password}
            onChange={register("password").onChange}
            name={register("password").name}
            error={errors.password?.message}
            placeholder="Enter your new password"
            icon={
              <KeyIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            }
            rightElement={
              <PasswordToggle
                showPassword={showPassword}
                togglePassword={() => setShowPassword(!showPassword)}
              />
            }
            autoComplete="new-password"
          />

          <FormInput
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            label="Confirm New Password"
            value={confirmPassword}
            onChange={register("confirmPassword").onChange}
            name={register("confirmPassword").name}
            error={errors.confirmPassword?.message}
            placeholder="Confirm your new password"
            icon={
              <KeyIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            }
            rightElement={
              <PasswordToggle
                showPassword={showConfirmPassword}
                togglePassword={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              />
            }
            autoComplete="new-password"
          />
        </div>

        <ErrorMessage message={errorMessage} />

        <div className="pt-4">
          <SubmitButton
            isPending={isSubmitting}
            text={{
              default: "Reset Password",
              pending: "Resetting...",
            }}
          />
        </div>

        <div className="text-center text-sm text-gray-600 py-4">
          Remember your password?{" "}
          <Link
            href="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
          >
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
}
