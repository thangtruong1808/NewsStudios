"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { authenticate } from "../actions";
import { toast } from "sonner";
import Link from "next/link";
import { AtSymbolIcon, KeyIcon } from "@heroicons/react/24/outline";
import FormInput from "./components/FormInput";
import ErrorMessage from "./components/ErrorMessage";
import SubmitButton from "./components/SubmitButton";
import PasswordToggle from "./components/PasswordToggle";
import { FormData, FormErrors, validateForm } from "./utils/validation";

export default function LoginForm() {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  const [isPending, setIsPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
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

    const formDataObj = new FormData();
    formDataObj.append("email", formData.email);
    formDataObj.append("password", formData.password);

    try {
      const result = await authenticate(undefined, formDataObj);
      if (result) {
        setErrorMessage(result);
      } else {
        toast.success("Logged in successfully!");
        router.push("/dashboard");
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormInput
        id="email"
        name="email"
        type="email"
        label="Email"
        value={formData.email}
        onChange={handleChange}
        error={formErrors.email}
        placeholder="Enter your email"
        icon={
          <AtSymbolIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
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
        icon={<KeyIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />}
        rightElement={
          <PasswordToggle
            showPassword={showPassword}
            togglePassword={() => setShowPassword(!showPassword)}
          />
        }
        autoComplete="current-password"
      />

      <ErrorMessage message={errorMessage} />

      <div className="flex items-center justify-between">
        <div className="text-sm">
          <Link
            href="/login/reset-password"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Forgot your password?
          </Link>
        </div>
      </div>

      <SubmitButton isPending={isPending} />
    </form>
  );
}
