"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { AtSymbolIcon, KeyIcon } from "@heroicons/react/24/outline";
import FormInput from "../components/FormInput";
import SubmitButton from "./components/SubmitButton";
import { resetPasswordFormSchema, ResetPasswordFormValues } from "./schema";
import { resetPassword } from "../actions/reset-password";

// Component Info
// Description: Handles reset-password form submission with validation and Next.js navigation.
// Data created: Local react-hook-form state and password update mutations.
// Author: thangtruong

export default function ResetPasswordForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: ResetPasswordFormValues) => {
    startTransition(() => {
      resetPassword({
        email: values.email.trim().toLowerCase(),
        password: values.password,
        confirmPassword: values.confirmPassword,
      })
        .then((response) => {
          if (!response || response.error) {
            toast.error(response?.error ?? "Unable to reset password. Please try again.", {
              duration: 7000,
            });
            return;
          }

          toast.success(`Password updated successfully, ${response.firstname ?? "user"}!`, {
            duration: 7000,
          });
          reset();
          router.push("/login");
        })
        .catch(() => {
          toast.error("Unable to reset password. Please try again later.", {
            duration: 7000,
          });
        });
    });
  };

  return (
    <section className="mx-auto w-full max-w-[420px] space-y-6">
      {/* Reset form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Credentials fields */}
        <div className="space-y-4">
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormInput
                id="email"
                type="email"
                label="Email Address"
                value={field.value}
                onChange={field.onChange}
                name={field.name}
                error={errors.email?.message}
                placeholder="you@example.com"
                icon={<AtSymbolIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />}
                autoComplete="email"
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormInput
                id="password"
                type="password"
                label="New Password"
                value={field.value}
                onChange={field.onChange}
                name={field.name}
                error={errors.password?.message}
                placeholder="Enter your new password"
                icon={<KeyIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />}
                autoComplete="new-password"
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <FormInput
                id="confirmPassword"
                type="password"
                label="Confirm New Password"
                value={field.value}
                onChange={field.onChange}
                name={field.name}
                error={errors.confirmPassword?.message}
                placeholder="Confirm your new password"
                icon={<KeyIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />}
                autoComplete="new-password"
              />
            )}
          />
        </div>

        {/* Submit button */}
        <SubmitButton isPending={isPending}>Reset Password</SubmitButton>

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
