"use server";

import { signIn } from "../auth";
import { AuthError } from "next-auth";
import { getUserByEmail } from "./lib/actions/users";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    const email = formData.get("email") as string;
    const result = await signIn("credentials", {
      email,
      password: formData.get("password"),
      redirect: false,
    });

    if (result?.error) {
      return "Invalid credentials.";
    }

    // Get user data to return role
    const user = await getUserByEmail(email);
    if (!user) {
      return "User not found.";
    }

    return {
      success: true,
      role: user.role,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}
