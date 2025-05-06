"use server";

import { query, transaction } from "../db/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { Advertisement, CreateAdvertisementData } from "../definition";
import { revalidatePath } from "next/cache";

interface IdResult extends RowDataPacket {
  id: number;
}

interface AdvertisementWithRelations extends Advertisement, RowDataPacket {
  sponsor_name: string;
  article_title: string;
  category_name: string;
}

export async function getAdvertisements() {
  try {
    const result = await query<Advertisement>(`
      SELECT a.*, s.name as sponsor_name, ar.title as article_title, c.name as category_name
      FROM Advertisements a
      LEFT JOIN Sponsors s ON a.sponsor_id = s.id
      LEFT JOIN Articles ar ON a.article_id = ar.id
      LEFT JOIN Categories c ON a.category_id = c.id
      ORDER BY a.created_at DESC
    `);

    if (result.error) {
      return { data: null, error: result.error };
    }

    return { data: result.data || [], error: null };
  } catch (error) {
    console.error("Error fetching advertisements:", error);
    return { data: null, error: "Failed to fetch advertisements" };
  }
}

export async function searchAdvertisements(searchQuery: string) {
  try {
    const result = await query(
      `
      SELECT 
        a.*,
        s.name as sponsor_name,
        art.title as article_title,
        c.name as category_name
      FROM Advertisements a
      LEFT JOIN Sponsors s ON a.sponsor_id = s.id
      LEFT JOIN Articles art ON a.article_id = art.id
      LEFT JOIN Categories c ON a.category_id = c.id
      WHERE 
        s.name LIKE ? OR 
        art.title LIKE ? OR 
        c.name LIKE ? OR
        a.ad_type LIKE ? OR
        a.ad_content LIKE ?
      ORDER BY a.created_at DESC
    `,
      [
        `%${searchQuery}%`,
        `%${searchQuery}%`,
        `%${searchQuery}%`,
        `%${searchQuery}%`,
        `%${searchQuery}%`,
      ]
    );

    if (result.error) {
      return { data: null, error: result.error };
    }

    return { data: result.data as AdvertisementWithRelations[], error: null };
  } catch (error) {
    console.error("Error searching advertisements:", error);
    return {
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "Failed to search advertisements",
    };
  }
}

export async function getAdvertisementById(id: number) {
  try {
    const result = await query<Advertisement>(
      `SELECT a.*, s.name as sponsor_name, ar.title as article_title, c.name as category_name
       FROM Advertisements a
       LEFT JOIN Sponsors s ON a.sponsor_id = s.id
       LEFT JOIN Articles ar ON a.article_id = ar.id
       LEFT JOIN Categories c ON a.category_id = c.id
       WHERE a.id = ?`,
      [id]
    );

    if (result.error) {
      return { data: null, error: result.error };
    }

    return { data: result.data?.[0] || null, error: null };
  } catch (error) {
    console.error("Error fetching advertisement:", error);
    return { data: null, error: "Failed to fetch advertisement" };
  }
}

export async function deleteAdvertisement(id: number) {
  try {
    // Use transaction to ensure data consistency
    const result = await transaction(async (connection) => {
      const [rows] = await connection.execute(
        "DELETE FROM Advertisements WHERE id = ?",
        [id]
      );

      return rows;
    });

    revalidatePath("/dashboard/advertisements");
    return { data: result, error: null };
  } catch (error) {
    console.error("Error deleting advertisement:", error);
    return { data: null, error: "Failed to delete advertisement" };
  }
}

export async function getExistingIds() {
  try {
    // Get sponsors
    const sponsorsResult = await query("SELECT id FROM Sponsors ORDER BY id");
    const sponsors = (sponsorsResult.data as IdResult[]) || [];

    // Get articles
    const articlesResult = await query("SELECT id FROM Articles ORDER BY id");
    const articles = (articlesResult.data as IdResult[]) || [];

    // Get categories
    const categoriesResult = await query(
      "SELECT id FROM Categories ORDER BY id"
    );
    const categories = (categoriesResult.data as IdResult[]) || [];

    return {
      sponsors: sponsors.map((s) => s.id),
      articles: articles.map((a) => a.id),
      categories: categories.map((c) => c.id),
    };
  } catch (error) {
    console.error("Error getting existing IDs:", error);
    return {
      sponsors: [],
      articles: [],
      categories: [],
    };
  }
}

export async function insertSampleAdvertisements() {
  try {
    const { sponsors, articles, categories } = await getExistingIds();

    if (
      sponsors.length === 0 ||
      articles.length === 0 ||
      categories.length === 0
    ) {
      return {
        success: false,
        error:
          "Missing required data. Please ensure there are sponsors, articles, and categories in the database.",
      };
    }

    const sampleAds = [
      {
        sponsor_id: sponsors[0],
        article_id: articles[0],
        category_id: categories[0],
        start_date: new Date(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        ad_type: "banner",
        ad_content: "Special promotion for our featured article!",
        image_url: "https://example.com/ads/banner1.jpg",
      },
      {
        sponsor_id: sponsors[0],
        article_id: articles[1],
        category_id: categories[1],
        start_date: new Date(),
        end_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        ad_type: "video",
        ad_content: "Watch our latest video content!",
        video_url: "https://example.com/ads/video1.mp4",
      },
      {
        sponsor_id: sponsors[1],
        article_id: articles[2],
        category_id: categories[2],
        start_date: new Date(),
        end_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
        ad_type: "banner",
        ad_content: "Exclusive content available now!",
        image_url: "https://example.com/ads/banner2.jpg",
      },
      {
        sponsor_id: sponsors[1],
        article_id: articles[3],
        category_id: categories[0],
        start_date: new Date(),
        end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        ad_type: "video",
        ad_content: "Don't miss out on this special feature!",
        video_url: "https://example.com/ads/video2.mp4",
      },
      {
        sponsor_id: sponsors[2],
        article_id: articles[4],
        category_id: categories[1],
        start_date: new Date(),
        end_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        ad_type: "banner",
        ad_content: "Limited time offer!",
        image_url: "https://example.com/ads/banner3.jpg",
      },
      {
        sponsor_id: sponsors[2],
        article_id: articles[0],
        category_id: categories[2],
        start_date: new Date(),
        end_date: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000), // 75 days from now
        ad_type: "video",
        ad_content: "Check out our latest updates!",
        video_url: "https://example.com/ads/video3.mp4",
      },
      {
        sponsor_id: sponsors[0],
        article_id: articles[1],
        category_id: categories[0],
        start_date: new Date(),
        end_date: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), // 120 days from now
        ad_type: "banner",
        ad_content: "New content available!",
        image_url: "https://example.com/ads/banner4.jpg",
      },
      {
        sponsor_id: sponsors[1],
        article_id: articles[2],
        category_id: categories[1],
        start_date: new Date(),
        end_date: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000), // 50 days from now
        ad_type: "video",
        ad_content: "Exclusive video content!",
        video_url: "https://example.com/ads/video4.mp4",
      },
      {
        sponsor_id: sponsors[2],
        article_id: articles[3],
        category_id: categories[2],
        start_date: new Date(),
        end_date: new Date(Date.now() + 100 * 24 * 60 * 60 * 1000), // 100 days from now
        ad_type: "banner",
        ad_content: "Special announcement!",
        image_url: "https://example.com/ads/banner5.jpg",
      },
      {
        sponsor_id: sponsors[0],
        article_id: articles[4],
        category_id: categories[0],
        start_date: new Date(),
        end_date: new Date(Date.now() + 80 * 24 * 60 * 60 * 1000), // 80 days from now
        ad_type: "video",
        ad_content: "Must-watch content!",
        video_url: "https://example.com/ads/video5.mp4",
      },
    ];

    for (const ad of sampleAds) {
      await query(
        `INSERT INTO Advertisements (
          sponsor_id, article_id, category_id, start_date, end_date,
          ad_type, ad_content, image_url, video_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          ad.sponsor_id,
          ad.article_id,
          ad.category_id,
          ad.start_date,
          ad.end_date,
          ad.ad_type,
          ad.ad_content,
          ad.image_url || null,
          ad.video_url || null,
        ]
      );
    }

    return {
      success: true,
      message: "Successfully inserted 10 sample advertisements",
    };
  } catch (error) {
    console.error("Error inserting sample advertisements:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to insert sample advertisements",
    };
  }
}

export async function createAdvertisement(data: {
  sponsor_id: number;
  article_id?: number;
  category_id?: number;
  ad_type: "banner" | "video";
  ad_content: string;
  start_date: string;
  end_date: string;
  image_url: string | null;
  video_url: string | null;
}) {
  try {
    // Validate required fields
    if (
      !data.sponsor_id ||
      !data.ad_type ||
      !data.start_date ||
      !data.end_date ||
      !data.ad_content
    ) {
      throw new Error("Missing required fields");
    }

    const result = await transaction(async (connection) => {
      const [rows] = await connection.execute(
        `INSERT INTO Advertisements (
          sponsor_id,
          article_id,
          category_id,
          ad_type,
          ad_content,
          start_date,
          end_date,
          image_url,
          video_url,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          data.sponsor_id,
          data.article_id || null,
          data.category_id || null,
          data.ad_type,
          data.ad_content,
          data.start_date,
          data.end_date,
          data.image_url,
          data.video_url,
        ]
      );
      return rows;
    });

    return { success: true, id: (result as any).insertId };
  } catch (error) {
    console.error("Error creating advertisement:", error);
    throw new Error("Failed to create advertisement");
  }
}

export async function updateAdvertisement(
  id: number,
  data: Partial<Advertisement>
) {
  try {
    // Use transaction to ensure data consistency
    const result = await transaction(async (connection) => {
      const [rows] = await connection.execute(
        `UPDATE Advertisements 
         SET sponsor_id = ?, article_id = ?, category_id = ?, ad_type = ?, 
             ad_content = ?, start_date = ?, end_date = ?, image_url = ?, 
             video_url = ?, updated_at = NOW()
         WHERE id = ?`,
        [
          data.sponsor_id,
          data.article_id,
          data.category_id,
          data.ad_type,
          data.ad_content,
          data.start_date,
          data.end_date,
          data.image_url || null,
          data.video_url || null,
          id,
        ]
      );

      return rows;
    });

    revalidatePath("/dashboard/advertisements");
    return { data: result, error: null };
  } catch (error) {
    console.error("Error updating advertisement:", error);
    return { data: null, error: "Failed to update advertisement" };
  }
}
