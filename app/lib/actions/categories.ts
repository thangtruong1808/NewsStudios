"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { query } from "../db/db";
import { CategoryFormData } from "../validations/categorySchema";
import { Category } from "../../type/definitions";

export async function getCategories() {
  try {
    const result = await query("SELECT * FROM Categories ORDER BY name");
    if (result.error) {
      return { data: null, error: result.error };
    }
    return { data: result.data as Category[], error: null };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { data: null, error: "Failed to fetch categories" };
  }
}

export async function getCategoryById(id: number) {
  try {
    const result = await query("SELECT * FROM Categories WHERE id = ?", [id]);
    if (result.error) {
      return { data: null, error: result.error };
    }
    const category = (result.data as any[])?.[0] || null;
    return { data: category as Category | null, error: null };
  } catch (error) {
    console.error("Error fetching category:", error);
    return { data: null, error: "Failed to fetch category" };
  }
}

export async function createCategory(data: CategoryFormData) {
  try {
    await query("INSERT INTO Categories (name, description) VALUES (?, ?)", [
      data.name,
      data.description || null,
    ]);
    revalidatePath("/dashboard/categories");
    return { data: null, error: null };
  } catch (error) {
    console.error("Error creating category:", error);
    return { data: null, error: "Failed to create category" };
  }
}

export async function updateCategory(id: number, data: CategoryFormData) {
  try {
    await query(
      "UPDATE Categories SET name = ?, description = ? WHERE id = ?",
      [data.name, data.description || null, id]
    );
    revalidatePath("/dashboard/categories");
    return { data: null, error: null };
  } catch (error) {
    console.error("Error updating category:", error);
    return { data: null, error: "Failed to update category" };
  }
}

export async function deleteCategory(id: number) {
  try {
    await query("DELETE FROM Categories WHERE id = ?", [id]);
    revalidatePath("/dashboard/categories");
    return { data: null, error: null };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { data: null, error: "Failed to delete category" };
  }
}

export async function searchCategories(searchQuery: string) {
  try {
    const result = await query(
      "SELECT * FROM Categories WHERE name LIKE ? ORDER BY name",
      [`%${searchQuery}%`]
    );
    if (result.error) {
      return { data: null, error: result.error };
    }
    return { data: result.data as Category[], error: null };
  } catch (error) {
    console.error("Error searching categories:", error);
    return { data: null, error: "Failed to search categories" };
  }
}
