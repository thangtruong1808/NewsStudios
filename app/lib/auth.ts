"use server";

import { getUserByEmail } from "./actions/users";
import { LoginFormData, AuthResponse, User } from "../type/definitions";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function authenticateUser(
  credentials: LoginFormData
): Promise<AuthResponse> {
  try {
    // Get user by email
    const user = await getUserByEmail(credentials.email);

    if (!user) {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    // Check if user is active
    if (user.status !== "active") {
      return {
        success: false,
        error: "Your account is inactive. Please contact support.",
      };
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      user.password
    );

    if (!isPasswordValid) {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    // Remove password from user object
    const { password, ...userWithoutPassword } = user;

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return {
      success: true,
      user: userWithoutPassword as Omit<User, "password">,
      token,
    };
  } catch (error) {
    console.error("Authentication error:", error);
    return {
      success: false,
      error: "An error occurred during authentication",
    };
  }
}

export function verifyToken(token: string): {
  valid: boolean;
  userId?: number;
} {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    return { valid: true, userId: decoded.userId };
  } catch (error) {
    return { valid: false };
  }
}
