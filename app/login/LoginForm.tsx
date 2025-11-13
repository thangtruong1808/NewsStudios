"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import Link from "next/link";
import { AtSymbolIcon, KeyIcon } from "@heroicons/react/24/outline";
import FormInput from "./components/FormInput";
import ErrorMessage from "./components/ErrorMessage";
import SubmitButton from "./components/SubmitButton";
import PasswordToggle from "./components/PasswordToggle";
import { LoginFormData, FormErrors, validateForm } from "./utils/validation";

// Component Info
// Description: Credential-based login form with validation, error handling, and helper tips.
// Data created: Local form state, validation messages, and controlled input handling.
// Author: thangtruong

export default function LoginForm() {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  const [isPending, setIsPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const router = useRouter();

  // Handle input changes
  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field when user starts typing
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validate form before submission
    const errors = validateForm(formData);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsPending(true);
    setErrorMessage(undefined);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setErrorMessage(result.error);
        return;
      }

      toast.success("Logged in successfully!");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setErrorMessage("An unexpected error occurred.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[360px] space-y-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-4">
          <FormInput
            id="email"
            name="email"
            type="email"
            label="Email Address"
            value={formData.email}
            onChange={(value) => handleChange("email", value)}
            error={formErrors.email}
            placeholder="name@example.com"
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
            name="password"
            type={showPassword ? "text" : "password"}
            label="Password"
            value={formData.password}
            onChange={(value) => handleChange("password", value)}
            error={formErrors.password}
            placeholder="Enter your password"
            icon={
              <KeyIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            }
            rightElement={
              <PasswordToggle
                showPassword={showPassword}
                togglePassword={() => setShowPassword(!showPassword)}
              />
            }
            autoComplete="current-password"
          />
        </div>

        <ErrorMessage message={errorMessage} />

        <div className="flex justify-end text-sm">
          <Link
            href="/login/reset-password"
            className="font-semibold text-blue-500 transition-colors duration-200 hover:text-blue-600"
          >
            Forgot password?
          </Link>
        </div>

        <SubmitButton isPending={isPending} />
      </form>

      <div className="rounded-xl bg-slate-50 px-4 py-4 text-sm text-slate-600 shadow-inner ring-1 ring-slate-200/60">
        <p className="font-semibold text-slate-700">Need demo credentials?</p>
        <div className="mt-2 space-y-1">
          <div className="flex items-center justify-between rounded-md bg-white px-3 py-2 shadow-sm">
            <span className="text-slate-500">Username</span>
            <span className="font-medium text-slate-800">thang.t@gmail.com</span>
          </div>
          <div className="flex items-center justify-between rounded-md bg-white px-3 py-2 shadow-sm">
            <span className="text-slate-500">Password</span>
            <span className="font-medium text-slate-800">()_+Thang!@#$%^&</span>
          </div>
        </div>
      </div>
    </div>
  );
}
