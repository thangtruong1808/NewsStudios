"use server";

import { query } from "../lib/db/db";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

export interface LoginFormData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    role: string;
  };
  error?: string;
}

export async function authenticateUser(
  data: LoginFormData
): Promise<AuthResponse> {
  try {
    // Check if email and password are provided
    if (!data.email || !data.password) {
      return {
        success: false,
        error: "Email and password are required",
      };
    }

    // Query the database to find a user with the provided email
    const result = await query("SELECT * FROM Users WHERE email = ?", [
      data.email,
    ]);

    if (result.error) {
      console.error("Database error:", result.error);
      return {
        success: false,
        error: "An error occurred during authentication",
      };
    }

    // Check if user exists
    const users = result.data as any[];
    if (!users || users.length === 0) {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    const user = users[0];

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    // In a real application, you would use a proper session management system
    // For this example, we're just returning the user data
    // The client-side code will handle setting the cookie or storing the session

    // Return user data (excluding sensitive information like password)
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
      },
    };
  } catch (error) {
    console.error("Authentication error:", error);
    return {
      success: false,
      error: "An error occurred during authentication",
    };
  }
}

export async function logout() {
  // In a real application, you would clear the session on the server
  // For this example, we're just redirecting to the login page
  redirect("/login");
}

export async function login(_cookies: any) {
  // ... existing code ...
}
