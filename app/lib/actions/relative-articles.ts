"use server";

import { query } from "../db/db";
import { Article } from "../definition";

export async function getRelativeArticles(
  currentArticleId?: number,
  page: number = 1,
  limit: number = 4
) {
  try {
    // Calculate offset for MySQL pagination
    const offset = (page - 1) * limit;

    // First get the current article's category and tags
    const currentArticleQuery = currentArticleId
      ? await query(
          `
          SELECT 
            a.category_id,
            a.sub_category_id,
            GROUP_CONCAT(t.id) as tag_ids
          FROM Articles a
          LEFT JOIN Article_Tags at ON a.id = at.article_id
          LEFT JOIN Tags t ON at.tag_id = t.id
          WHERE a.id = ?
          GROUP BY a.id
        `,
          [currentArticleId]
        )
      : null;

    const currentArticle = currentArticleQuery?.data?.[0];
    const tagIds = currentArticle?.tag_ids
      ? currentArticle.tag_ids.split(",")
      : [];
    const categoryId = currentArticle?.category_id;
    const subCategoryId = currentArticle?.sub_category_id;

    // If no current article ID is provided, get all articles
    const whereClause = currentArticleId
      ? `WHERE a.id != ? AND (
          a.category_id = ? 
          OR a.sub_category_id = ?
          OR at.tag_id IN (${tagIds.length > 0 ? tagIds.join(",") : "0"})
        )`
      : "";

    // Build the query to find related articles
    const result = await query(
      `
      SELECT 
        a.*,
        c.name as category_name,
        sc.name as subcategory_name,
        au.name as author_name,
        GROUP_CONCAT(DISTINCT t.name) as tag_names,
        GROUP_CONCAT(DISTINCT t.color) as tag_colors,
        (SELECT COUNT(*) FROM Likes WHERE article_id = a.id) as likes_count,
        (SELECT COUNT(*) FROM Comments WHERE article_id = a.id) as comments_count,
        (
          SELECT COUNT(DISTINCT a2.id) 
          FROM Articles a2
          LEFT JOIN Article_Tags at2 ON a2.id = at2.article_id
          ${currentArticleId ? `WHERE a2.id != ?` : ""}
        ) as total_count
      FROM Articles a
      LEFT JOIN Categories c ON a.category_id = c.id
      LEFT JOIN SubCategories sc ON a.sub_category_id = sc.id
      LEFT JOIN Authors au ON a.author_id = au.id
      LEFT JOIN Article_Tags at ON a.id = at.article_id
      LEFT JOIN Tags t ON at.tag_id = t.id
      ${whereClause}
      GROUP BY a.id
      ORDER BY 
        CASE 
          WHEN a.category_id = ? AND a.sub_category_id = ? THEN 1
          WHEN a.category_id = ? THEN 2
          WHEN a.sub_category_id = ? THEN 3
          ELSE 4
        END,
        a.published_at DESC
      LIMIT ? OFFSET ?
    `,
      currentArticleId
        ? [
            currentArticleId,
            categoryId || 0,
            subCategoryId || 0,
            currentArticleId,
            categoryId || 0,
            subCategoryId || 0,
            categoryId || 0,
            subCategoryId || 0,
            limit,
            offset,
          ]
        : [
            categoryId || 0,
            subCategoryId || 0,
            categoryId || 0,
            subCategoryId || 0,
            limit,
            offset,
          ]
    );

    if (!result.data || result.data.length === 0) {
      console.log("No relative articles found");
      return { data: [], totalCount: 0 };
    }

    const totalCount = result.data[0].total_count;
    const articles = result.data.map((article) => ({
      ...article,
      tag_names: article.tag_names ? article.tag_names.split(",") : [],
      tag_colors: article.tag_colors ? article.tag_colors.split(",") : [],
      likes_count: Number(article.likes_count) || 0,
      comments_count: Number(article.comments_count) || 0,
      views_count: 0, // Set default value since Views table doesn't exist
    }));

    return { data: articles, totalCount };
  } catch (error) {
    console.error("Error fetching relative articles:", error);
    return { error: "Failed to fetch relative articles" };
  }
}
