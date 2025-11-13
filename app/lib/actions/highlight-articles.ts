"use server";

import { query } from "../db/db";

type HighlightArticleRow = {
  total_count: number;
  tag_names?: string | null;
  tag_ids?: string | null;
  tag_colors?: string | null;
  likes_count?: number | null;
  comments_count?: number | null;
  is_featured?: number | boolean | null;
  is_trending?: number | boolean | null;
  headline_priority?: number | null;
  published_at: string | Date;
  updated_at: string | Date;
} & Record<string, unknown>;

export async function getHighlightArticles({
  page = 1,
  itemsPerPage = 6,
}: {
  page?: number;
  itemsPerPage?: number;
} = {}) {
  try {
    const offset = (page - 1) * itemsPerPage;

    const { data, error } = await query<HighlightArticleRow>(
      `
      SELECT 
        a.*,
        c.name as category_name,
        sc.name as subcategory_name,
        au.name as author_name,
        GROUP_CONCAT(t.name) as tag_names,
        GROUP_CONCAT(t.id) as tag_ids,
        GROUP_CONCAT(t.color) as tag_colors,
        (SELECT COUNT(*) FROM Likes WHERE article_id = a.id) as likes_count,
        (SELECT COUNT(*) FROM Comments WHERE article_id = a.id) as comments_count,
        (SELECT COUNT(*) FROM Articles WHERE headline_priority != 0) as total_count
      FROM Articles a
      LEFT JOIN Categories c ON a.category_id = c.id
      LEFT JOIN SubCategories sc ON a.sub_category_id = sc.id
      LEFT JOIN Authors au ON a.author_id = au.id
      LEFT JOIN Article_Tags at ON a.id = at.article_id
      LEFT JOIN Tags t ON at.tag_id = t.id
      WHERE a.headline_priority != 0
      GROUP BY a.id, c.name, sc.name, au.name
      ORDER BY a.headline_priority DESC, a.published_at DESC
      LIMIT ? OFFSET ?
    `,
      [itemsPerPage, offset]
    );

    const rows = Array.isArray(data) ? (data as HighlightArticleRow[]) : [];

    if (error) {
      return { data: [], error, totalCount: 0 };
    }

    if (rows.length === 0) {
      return { data: [], error: null, totalCount: 0 };
    }

    const articles = rows.map((article) => ({
      ...article,
      published_at: new Date(article.published_at),
      updated_at: new Date(article.updated_at),
      is_featured: Boolean(article.is_featured),
      is_trending: Boolean(article.is_trending),
      headline_priority: Number(article.headline_priority ?? 0),
      tag_names: article.tag_names ? article.tag_names.split(",") : [],
      tag_ids: article.tag_ids ? article.tag_ids.split(",").map(Number) : [],
      tag_colors: article.tag_colors ? article.tag_colors.split(",") : [],
      likes_count: Number(article.likes_count ?? 0),
      comments_count: Number(article.comments_count ?? 0),
      views_count: 0,
    }));

    const totalCount = Number(rows[0].total_count ?? 0);
    return { data: articles, error: null, totalCount };
  } catch (_error) {
    return {
      data: [],
      error: "Failed to fetch highlight articles",
      totalCount: 0,
    };
  }
}
