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

    // Get complete user data
    const user = await getUserByEmail(email);
    if (!user) {
      return "User not found.";
    }

    return {
      success: true,
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        status: user.status,
        description: user.description,
        user_image: user.user_image,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
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
