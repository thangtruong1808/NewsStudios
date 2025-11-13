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

// Component Info
// Description: Handles reset-password form submission with validation and Next.js navigation.
// Data created: Local form state, validation feedback, and password reset mutation requests.
// Author: thangtruong

export default function ResetPasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
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
    } catch (_error) {
      setErrorMessage("An error occurred while resetting your password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-[420px] space-y-6">
      {/* Reset form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Credentials fields */}
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
            icon={<AtSymbolIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />}
            autoComplete="email"
            isReactHookForm={true}
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
            icon={<KeyIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />}
            rightElement={
              <PasswordToggle
                showPassword={showPassword}
                togglePassword={() => setShowPassword(!showPassword)}
              />
            }
            autoComplete="new-password"
            isReactHookForm={true}
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
            icon={<KeyIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />}
            rightElement={
              <PasswordToggle
                showPassword={showConfirmPassword}
                togglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            }
            autoComplete="new-password"
            isReactHookForm={true}
          />
        </div>

        <ErrorMessage message={errorMessage} />

        {/* Submit button */}
        <div className="pt-4">
          <SubmitButton
            isPending={isSubmitting}
            text={{ default: "Reset Password", pending: "Resetting..." }}
          />
        </div>

        {/* Back to login */}
        <div className="py-4 text-center text-sm text-gray-600">
          Remember your password?{" "}
          <Link
            href="/login"
            className="font-medium text-indigo-600 transition-colors duration-200 hover:text-indigo-500"
          >
            Back to Login
          </Link>
        </div>
      </form>
    </section>
  );
}
