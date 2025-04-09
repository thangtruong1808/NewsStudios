import { Category } from "@/app/components/dashboard/categories/types";
import { db } from "@/app/lib/db";

export async function getCategories(
  searchTerm: string = ""
): Promise<Category[]> {
  try {
    const categories = await db.category.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: "insensitive" } },
          { description: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
}
