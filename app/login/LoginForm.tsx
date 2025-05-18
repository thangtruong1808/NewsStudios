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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
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
      console.error("Login error:", error);
      setErrorMessage("An unexpected error occurred.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <FormInput
            id="email"
            name="email"
            type="email"
            label="Email Address"
            value={formData.email}
            onChange={handleChange}
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
            onChange={handleChange}
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

        <div className="flex justify-end">
          <div className="text-sm">
            <Link
              href="/login/reset-password"
              className="font-medium text-blue-400 hover:text-blue-600 transition-colors duration-200"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        <div className="">
          <SubmitButton isPending={isPending} />
        </div>
        <div className="flex flex-col items-start py-4">
          <p>
            <label
              className="block text-gray-500 text-sm mb-2"
              htmlFor="username"
            >
              Username:<span className="px-3">user@nextmail.com</span>
            </label>
          </p>
          <p>
            <label
              className="block text-gray-500 text-sm mb-2"
              htmlFor="password"
            >
              Password:<span className="px-3">25Thang!@</span>
            </label>
          </p>
        </div>
      </form>
    </div>
  );
}
