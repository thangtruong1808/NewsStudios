import { query } from "../db/db";

interface Photo {
  id: number;
  image_url: string;
  description?: string;
  created_at: string;
  updated_at: string;
  article_id?: number;
  article_title?: string;
}

export async function searchPhotos(searchQuery: string) {
  try {
    const result = await query(
      `SELECT p.*, a.title as article_title 
       FROM Photos p
       LEFT JOIN Articles a ON p.article_id = a.id
       WHERE a.id LIKE ? OR a.title LIKE ? OR p.description LIKE ?
       ORDER BY p.created_at DESC`,
      [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`]
    );

    if (result.error) {
      return { data: [], error: result.error, totalItems: 0, totalPages: 0 };
    }

    const photos = result.data as Photo[];
    return {
      data: photos,
      error: null,
      totalItems: photos.length,
      totalPages: 1,
    };
  } catch (error) {
    return {
      data: [],
      error: "Failed to search photos",
      totalItems: 0,
      totalPages: 0,
    };
  }
}
