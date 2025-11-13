"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import {
  AtSymbolIcon,
  KeyIcon,
  UserIcon,
  ChatBubbleBottomCenterTextIcon,
} from "@heroicons/react/24/outline";
import FormInput from "@/app/login/components/FormInput";
import PasswordToggle from "@/app/login/components/PasswordToggle";
import SubmitButton from "@/app/login/components/SubmitButton";
import ErrorMessage from "@/app/login/components/ErrorMessage";
import { registerUser } from "./actions";
import { signUpSchema, SignUpFormData } from "./schema";

// Component Info
// Description: Registration form collecting user profile details and creating a new account.
// Data created: Form state managed via react-hook-form and server-side registration mutations.
// Author: thangtruong

export default function SignUpForm() {
  const router = useRouter();
  const [globalError, setGlobalError] = useState<string | undefined>(undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmPassword: "",
      description: "",
    },
  });

  const onSubmit = (data: SignUpFormData) => {
    setGlobalError(undefined);
    startTransition(() => {
      registerUser({
        firstname: data.firstname.trim(),
        lastname: data.lastname.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
        description: data.description ? data.description.trim() : undefined,
      })
        .then((result) => {
          if (!result.success) {
            setGlobalError(result.error ?? "Unable to create your account.");
            return;
          }

          toast.success(`Welcome aboard, ${data.firstname}! Your account is ready.`, {
            duration: 7000,
          });
          reset();
          router.push("/login");
        })
        .catch(() => {
          setGlobalError("Unable to create your account. Please try again later.");
        });
    });
  };

  return (
    <section className="space-y-6">
      {/* Form container */}
      <div className="mx-auto w-full space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto w-full max-w-3xl space-y-5">
          {/* Basic information */}
          <div className="grid gap-4 sm:grid-cols-2 lg:gap-6">
            <Controller
              control={control}
              name="firstname"
              render={({ field }) => (
                <FormInput
                  id="firstname"
                  name={field.name}
                  type="text"
                  label="First name"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.firstname?.message}
                  placeholder="Jane"
                  icon={<UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />}
                  autoComplete="given-name"
                />
              )}
            />

            <Controller
              control={control}
              name="lastname"
              render={({ field }) => (
                <FormInput
                  id="lastname"
                  name={field.name}
                  type="text"
                  label="Last name"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.lastname?.message}
                  placeholder="Doe"
                  icon={<UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />}
                  autoComplete="family-name"
                />
              )}
            />
          </div>

          {/* Contact and security */}
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormInput
                id="email"
                name={field.name}
                type="email"
                label="Email address"
                value={field.value}
                onChange={field.onChange}
                error={errors.email?.message}
                placeholder="jane.doe@example.com"
                icon={<AtSymbolIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />}
                autoComplete="email"
              />
            )}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <FormInput
                  id="password"
                  name={field.name}
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.password?.message}
                  placeholder="Create a secure password"
                  icon={<KeyIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />}
                  rightElement={
                    <PasswordToggle
                      showPassword={showPassword}
                      togglePassword={() => setShowPassword((prev) => !prev)}
                    />
                  }
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
                  name={field.name}
                  type={showConfirmPassword ? "text" : "password"}
                  label="Confirm password"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.confirmPassword?.message}
                  placeholder="Re-enter your password"
                  icon={<KeyIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />}
                  rightElement={
                    <PasswordToggle
                      showPassword={showConfirmPassword}
                      togglePassword={() => setShowConfirmPassword((prev) => !prev)}
                    />
                  }
                  autoComplete="new-password"
                />
              )}
            />
          </div>

          {/* Optional description */}
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <div className="space-y-2">
                <label htmlFor="description" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <ChatBubbleBottomCenterTextIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  Short bio <span className="text-xs font-normal text-gray-400">(optional)</span>
                </label>
                <textarea
                  id="description"
                  rows={3}
                  value={field.value}
                  onChange={field.onChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="Tell us about your role in the newsroom"
                />
                <p className="text-xs text-gray-400">Use 160 characters or less to describe your focus or team.</p>
              </div>
            )}
          />

          <ErrorMessage message={globalError} />

          <SubmitButton
            isPending={isPending}
            text={{ default: "Create account", pending: "Creating account..." }}
          />
        </form>
      </div>
    </section>
  );
}
