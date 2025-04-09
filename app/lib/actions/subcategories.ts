"use server";

import { query } from "../db/db";
import { Subcategory } from "../../type/definitions";
import { revalidatePath } from "next/cache";

interface SubcategoryFormData {
  name: string;
  description?: string | null;
  category_id: number;
}

export async function getSubcategories() {
  try {
    const result = await query(`
      SELECT s.*, c.name as category_name 
      FROM SubCategories s
      LEFT JOIN Categories c ON s.category_id = c.id
      ORDER BY c.name ASC, s.name ASC
    `);
    return { data: result, error: null };
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return {
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch subcategories",
    };
  }
}

export async function getSubcategoryById(id: number) {
  try {
    const [subcategory] = await query(
      "SELECT * FROM SubCategories WHERE id = ?",
      [id]
    );
    return { data: subcategory, error: null };
  } catch (error) {
    console.error("Error fetching subcategory:", error);
    return { data: null, error: "Failed to fetch subcategory" };
  }
}

export async function createSubcategory(data: SubcategoryFormData) {
  try {
    const result = await query(
      `INSERT INTO SubCategories (name, description, category_id) 
       VALUES (?, ?, ?)`,
      [data.name, data.description || null, data.category_id]
    );

    // Serialize the response to only include necessary data
    return {
      success: true,
      data: {
        id: (result as any).insertId,
        name: data.name,
        description: data.description,
        category_id: data.category_id,
      },
      error: null,
    };
  } catch (error) {
    console.error("Error creating subcategory:", error);
    return {
      success: false,
      data: null,
      error:
        error instanceof Error ? error.message : "Failed to create subcategory",
    };
  }
}

export async function updateSubcategory(
  id: number,
  data: Partial<Omit<Subcategory, "id" | "created_at" | "updated_at">>
) {
  try {
    const fields = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = [...Object.values(data), id];

    await query(`UPDATE SubCategories SET ${fields} WHERE id = ?`, values);
    revalidatePath("/dashboard/SubCategories");
    return { data: true, error: null };
  } catch (error) {
    console.error("Error updating subcategory:", error);
    return { data: null, error: "Failed to update subcategory" };
  }
}

export async function deleteSubcategory(id: number) {
  try {
    await query("DELETE FROM SubCategories WHERE id = ?", [id]);
    revalidatePath("/dashboard/SubCategories");
    return { data: true, error: null };
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    return { data: null, error: "Failed to delete subcategory" };
  }
}
