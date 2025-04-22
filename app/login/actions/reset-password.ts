"use server";

import { query } from "@/app/lib/db/query";
import bcrypt from "bcryptjs";

export async function resetPassword(data: {
  email: string;
  password: string;
  confirmPassword: string;
}) {
  try {
    // Verify passwords match
    if (data.password !== data.confirmPassword) {
      return { error: "Passwords do not match" };
    }

    // Check if user exists
    const result = await query("SELECT id FROM Users WHERE email = ?", [
      data.email,
    ]);

    if (!result || !result.data || result.data.length === 0) {
      return { error: "User not found" };
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Update the password
    await query(
      "UPDATE Users SET password = ?, updated_at = NOW() WHERE email = ?",
      [hashedPassword, data.email]
    );

    return { success: true };
  } catch (error) {
    console.error("Password reset error:", error);
    return { error: "Failed to reset password" };
  }
}
