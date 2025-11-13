"use server";

import { createUser, getUserByEmail } from "@/app/lib/actions/users";
import type { UserFormData } from "@/app/lib/definition";

// Action Info
// Description: Server action registering a new end-user with default role and status.
// Data created: Inserts a Users row via existing user creation workflow.
// Author: thangtruong

interface RegisterUserPayload {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  description?: string;
}

export async function registerUser(payload: RegisterUserPayload) {
  const existing = await getUserByEmail(payload.email);
  if (existing) {
    return {
      success: false,
      error: "An account with this email already exists.",
    };
  }

  const userData: UserFormData = {
    firstname: payload.firstname,
    lastname: payload.lastname,
    email: payload.email,
    password: payload.password,
    role: "user",
    status: "active",
    description: payload.description || undefined,
    user_image: undefined,
  };

  const result = await createUser(userData);

  if (!result.success) {
    return {
      success: false,
      error: result.error ?? "Unable to create account. Please try again later.",
    };
  }

  return {
    success: true,
    data: result.data,
    error: null,
  };
}
