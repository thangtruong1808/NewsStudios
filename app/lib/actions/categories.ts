"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { query } from "../db/db";
import { CategoryFormData } from "../validations/categorySchema";

export async function getCategories() {
  try {
    const categories = await query("SELECT * FROM Categories ORDER BY name");
    return { data: categories, error: null };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { data: null, error: "Failed to fetch categories" };
  }
}

export async function getCategoryById(id: number) {
  try {
    const [category] = await query("SELECT * FROM Categories WHERE id = ?", [
      id,
    ]);
    return { data: category, error: null };
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
