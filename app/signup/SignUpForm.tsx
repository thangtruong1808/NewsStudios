"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { AtSymbolIcon, KeyIcon, UserIcon, ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/outline";
import FormInput from "@/app/login/components/FormInput";
import PasswordToggle from "@/app/login/components/PasswordToggle";
import SubmitButton from "@/app/login/components/SubmitButton";
import ErrorMessage from "@/app/login/components/ErrorMessage";
import { registerUser } from "./actions";

// Component Info
// Description: Registration form collecting user profile details and creating a new account.
// Data created: Local form state, validation feedback, and server-side registration mutations.
// Author: thangtruong
interface SignUpFormState {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
  description: string;
}
interface SignUpFormErrors {
  firstname?: string;
  lastname?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}
export default function SignUpForm() {
  const router = useRouter();
  const [formState, setFormState] = useState<SignUpFormState>({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState<SignUpFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [globalError, setGlobalError] = useState<string | undefined>(undefined);
  const [isPending, startTransition] = useTransition();

  const handleFieldChange = (field: keyof SignUpFormState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field as keyof SignUpFormErrors]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const errors: SignUpFormErrors = {};

    if (!formState.firstname.trim()) {
      errors.firstname = "First name is required.";
    }

    if (!formState.lastname.trim()) {
      errors.lastname = "Last name is required.";
    }

    if (!formState.email.trim()) {
      errors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      errors.email = "Please provide a valid email address.";
    }

    if (!formState.password) {
      errors.password = "Password is required.";
    } else if (formState.password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
    }

    if (!formState.confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (formState.confirmPassword !== formState.password) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setGlobalError(undefined);

    if (!validate()) {
      return;
    }

    startTransition(() => {
      registerUser({
        firstname: formState.firstname.trim(),
        lastname: formState.lastname.trim(),
        email: formState.email.trim().toLowerCase(),
        password: formState.password,
        description: formState.description.trim() || undefined,
      })
        .then((result) => {
          if (!result.success) {
            setGlobalError(result.error ?? "Unable to create your account.");
            return;
          }

          toast.success("Account created! Please sign in.");
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
        <form onSubmit={handleSubmit} className="mx-auto w-full max-w-3xl space-y-5">
          {/* Basic information */}
          <div className="grid gap-4 sm:grid-cols-2 lg:gap-6">
            <FormInput
              id="firstname"
              name="firstname"
              type="text"
              label="First name"
              value={formState.firstname}
              onChange={(value) => handleFieldChange("firstname", value)}
              error={formErrors.firstname}
              placeholder="Jane"
              icon={<UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />}
              autoComplete="given-name"
            />

            <FormInput
              id="lastname"
              name="lastname"
              type="text"
              label="Last name"
              value={formState.lastname}
              onChange={(value) => handleFieldChange("lastname", value)}
              error={formErrors.lastname}
              placeholder="Doe"
              icon={<UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />}
              autoComplete="family-name"
            />
          </div>

          {/* Contact and security */}
          <FormInput
            id="email"
            name="email"
            type="email"
            label="Email address"
            value={formState.email}
            onChange={(value) => handleFieldChange("email", value)}
            error={formErrors.email}
            placeholder="jane.doe@example.com"
            icon={<AtSymbolIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />}
            autoComplete="email"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              label="Password"
              value={formState.password}
              onChange={(value) => handleFieldChange("password", value)}
              error={formErrors.password}
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

            <FormInput
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              label="Confirm password"
              value={formState.confirmPassword}
              onChange={(value) => handleFieldChange("confirmPassword", value)}
              error={formErrors.confirmPassword}
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
          </div>

          {/* Optional description */}
          <div className="space-y-2">
            <label htmlFor="description" className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <ChatBubbleBottomCenterTextIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              Short bio <span className="text-xs font-normal text-gray-400">(optional)</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formState.description}
              onChange={(event) => handleFieldChange("description", event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="Tell us about your role in the newsroom"
            />
            <p className="text-xs text-gray-400">Use 160 characters or less to describe your focus or team.</p>
          </div>

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
