import { query } from "./db";
import { UserFormData } from "../validations/userSchema";
import bcrypt from "bcryptjs";
import { ResultSetHeader } from "mysql2";

interface QueryResponse {
  data: ResultSetHeader | null;
  error: string | null;
}

export async function createUser(userData: UserFormData) {
  if (!userData.password) {
    throw new Error("Password is required");
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const result = await query(
    `INSERT INTO Users (firstname, lastname, email, password, role, status, description)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      userData.firstname,
      userData.lastname,
      userData.email,
      hashedPassword,
      userData.role,
      userData.status,
      userData.description || null,
    ]
  );

  return result;
}

export async function updateUser(id: number, userData: UserFormData) {
  try {
    // If password is "********" or empty, don't update the password
    if (!userData.password || userData.password === "********") {
      // Update without password
      const result = await query(
        `UPDATE Users 
         SET firstname = ?, lastname = ?, email = ?, role = ?, status = ?, description = ?
         WHERE id = ?`,
        [
          userData.firstname,
          userData.lastname,
          userData.email,
          userData.role,
          userData.status,
          userData.description || null,
          id,
        ]
      );

      if (result.error) {
        throw new Error(result.error);
      }

      return result;
    }

    // Update with new password
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const result = await query(
      `UPDATE Users 
       SET firstname = ?, lastname = ?, email = ?, password = ?, role = ?, status = ?, description = ?
       WHERE id = ?`,
      [
        userData.firstname,
        userData.lastname,
        userData.email,
        hashedPassword,
        userData.role,
        userData.status,
        userData.description || null,
        id,
      ]
    );

    if (result.error) {
      throw new Error(result.error);
    }

    return result;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

export async function getUserById(id: number) {
  const [user] = await query("SELECT * FROM Users WHERE id = ?", [id]);
  return user;
}

export async function getUserByEmail(email: string) {
  const [user] = await query("SELECT * FROM Users WHERE email = ?", [email]);
  return user;
}
