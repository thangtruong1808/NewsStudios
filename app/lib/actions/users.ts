"use server";

import { query } from "../db/db";
import { User, UserFormData } from "../../login/login-definitions";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { ResultSetHeader } from "mysql2";

interface QueryResult {
  data: ResultSetHeader | null;
  error: string | null;
}

export async function getUsers() {
  try {
    const result = await query("SELECT * FROM Users ORDER BY created_at DESC");
    if (result.error) {
      return { data: [], error: result.error };
    }
    return { data: result.data as User[], error: null };
  } catch (error) {
    return { data: [], error: "Failed to fetch users" };
  }
}

export async function getUserById(id: number) {
  try {
    console.log(`Fetching user with ID: ${id}`);
    const result = await query("SELECT * FROM Users WHERE id = ?", [id]);

    if (result.error) {
      console.error(`Error fetching user ${id}:`, result.error);
      return { data: null, error: result.error };
    }

    // Extract only the user data from the result, ensuring proper typing
    const rows = result.data as any[];
    console.log(`Query result for user ${id}:`, rows);

    if (!rows || rows.length === 0) {
      console.log(`No user found with ID: ${id}`);
      return { data: null, error: "User not found" };
    }

    const userData = rows[0];
    console.log(`User data found:`, userData);

    // Return all user fields including password
    const user = {
      id: userData.id,
      firstname: userData.firstname,
      lastname: userData.lastname,
      email: userData.email,
      password: userData.password, // Include the password field
      role: userData.role,
      status: userData.status,
      description: userData.description,
      created_at: userData.created_at,
      updated_at: userData.updated_at,
    };

    return { data: user, error: null };
  } catch (error) {
    console.error(`Exception fetching user ${id}:`, error);
    return { data: null, error: "Failed to fetch user" };
  }
}

export async function getUserByEmail(email: string) {
  try {
    const result = await query("SELECT * FROM Users WHERE email = ?", [email]);
    if (result.error || !result.data) {
      return null;
    }
    const users = result.data as User[];
    return users[0] || null;
  } catch (error) {
    console.error("Error getting user by email:", error);
    return null;
  }
}

export async function createUser(userData: UserFormData) {
  try {
    const hashedPassword = userData.password
      ? await bcrypt.hash(userData.password, 10)
      : null;

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

    revalidatePath("/dashboard/users");

    // Return a serializable response
    return {
      success: true,
      data: {
        id: (result.data as ResultSetHeader)?.insertId,
        firstname: userData.firstname,
        lastname: userData.lastname,
        email: userData.email,
        role: userData.role,
        status: userData.status,
        description: userData.description,
      },
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: "Failed to create user",
    };
  }
}

export async function updateUser(
  id: number,
  userData: UserFormData
): Promise<{ success: boolean; data: any; error: string | null }> {
  try {
    // Check if the password is the same as the one in the database
    const userResult = await query("SELECT password FROM Users WHERE id = ?", [
      id,
    ]);
    const currentPassword =
      userResult.data &&
      Array.isArray(userResult.data) &&
      userResult.data.length > 0
        ? (userResult.data[0] as any).password
        : null;

    // If password is the same as the one in the database, don't update it
    if (userData.password === currentPassword) {
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

      revalidatePath("/dashboard/users");
      return {
        success: true,
        data: {
          id,
          ...userData,
          password: undefined,
        },
        error: null,
      };
    }

    // If password is empty or "********", don't update the password
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

      revalidatePath("/dashboard/users");
      return {
        success: true,
        data: {
          id,
          ...userData,
          password: undefined,
        },
        error: null,
      };
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

    revalidatePath("/dashboard/users");
    return {
      success: true,
      data: {
        id,
        ...userData,
        password: undefined,
      },
      error: null,
    };
  } catch (error) {
    console.error("Error updating user:", error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Failed to update user",
    };
  }
}

export async function deleteUser(id: number) {
  try {
    // First check if the user exists
    const userCheck = await query("SELECT id FROM Users WHERE id = ?", [id]);
    if (userCheck.error) {
      return {
        data: null,
        error: `Database error checking user: ${userCheck.error}`,
      };
    }

    if (
      !userCheck.data ||
      (Array.isArray(userCheck.data) && userCheck.data.length === 0)
    ) {
      return { data: null, error: "User not found" };
    }

    // Try to delete the user
    const result = await query("DELETE FROM Users WHERE id = ?", [id]);

    if (result.error) {
      // Check for foreign key constraint errors
      if (result.error.includes("foreign key constraint")) {
        return {
          data: null,
          error:
            "Cannot delete user because they are referenced by other records. Please remove these references first.",
        };
      }
      return { data: null, error: `Database error: ${result.error}` };
    }

    revalidatePath("/dashboard/users");
    return { data: result, error: null };
  } catch (error) {
    console.error("Error in deleteUser:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to delete user",
    };
  }
}

export async function searchUsers(searchQuery: string) {
  try {
    if (!searchQuery.trim()) {
      return getUsers();
    }

    const sqlQuery = `
      SELECT * FROM Users 
      WHERE firstname LIKE ? 
      OR lastname LIKE ? 
      OR email LIKE ?
      ORDER BY created_at DESC
    `;

    const searchPattern = `%${searchQuery}%`;
    const result = await query(sqlQuery, [
      searchPattern,
      searchPattern,
      searchPattern,
    ]);

    if (result.error) {
      return { data: [], error: result.error };
    }

    return { data: result.data as User[], error: null };
  } catch (error) {
    return { data: [], error: "Failed to search users" };
  }
}
