"use server";

import { query } from "@/app/lib/db/query";
import bcrypt from "bcryptjs";

// Action Info
// Description: Updates a user's password after validating email and confirmation fields.
// Data created: Persists hashed password updates in the Users table.
// Author: thangtruong

export async function resetPassword(data: {
  email: string;
  password: string;
  confirmPassword: string;
}) {
  try {
    if (data.password !== data.confirmPassword) {
      return { error: "Passwords do not match" };
    }

    const result = await query("SELECT id, firstname FROM Users WHERE email = ?", [
      data.email,
    ]);

    if (!result || !result.data || result.data.length === 0) {
      return { error: "User not found" };
    }

    const userRow = result.data[0] as { id: number; firstname?: string };
    const hashedPassword = await bcrypt.hash(data.password, 10);

    await query("UPDATE Users SET password = ?, updated_at = NOW() WHERE email = ?", [
      hashedPassword,
      data.email,
    ]);

    return { success: true, firstname: userRow.firstname ?? "User" };
  } catch (_error) {
    return { error: "Failed to reset password" };
  }
}
