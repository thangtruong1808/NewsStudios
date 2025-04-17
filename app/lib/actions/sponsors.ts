"use server";

import { revalidatePath } from "next/cache";
import { query } from "../db/db";
import { Sponsor } from "../definition";

export async function getSponsors() {
  try {
    const result = await query("SELECT * FROM Sponsors ORDER BY name ASC");
    if (result.error) {
      return { data: null, error: result.error };
    }
    return { data: result.data as Sponsor[], error: null };
  } catch (error) {
    console.error("Error fetching sponsors:", error);
    return {
      data: null,
      error:
        error instanceof Error ? error.message : "Failed to fetch sponsors",
    };
  }
}

export async function searchSponsors(searchQuery: string) {
  try {
    const result = await query(
      "SELECT * FROM Sponsors WHERE name LIKE ? ORDER BY name ASC",
      [`%${searchQuery}%`]
    );
    if (result.error) {
      return { data: null, error: result.error };
    }
    return { data: result.data as Sponsor[], error: null };
  } catch (error) {
    console.error("Error searching sponsors:", error);
    return {
      data: null,
      error:
        error instanceof Error ? error.message : "Failed to search sponsors",
    };
  }
}

export async function getSponsorById(id: number) {
  try {
    const result = await query("SELECT * FROM Sponsors WHERE id = ?", [id]);
    if (result.error) {
      return { data: null, error: result.error };
    }
    const sponsors = result.data as Sponsor[];
    const sponsor = sponsors.length > 0 ? sponsors[0] : null;
    return { data: sponsor, error: null };
  } catch (error) {
    console.error(`Error fetching sponsor with ID ${id}:`, error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch sponsor",
    };
  }
}

export async function createSponsor(sponsorData: {
  name: string;
  contact_email?: string;
  contact_phone?: string;
  website_url?: string;
  image_url?: string;
  video_url?: string;
  description?: string;
}) {
  try {
    const result = await query(
      `INSERT INTO Sponsors (
        name, contact_email, contact_phone, website_url, 
        image_url, video_url, description
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        sponsorData.name,
        sponsorData.contact_email || null,
        sponsorData.contact_phone || null,
        sponsorData.website_url || null,
        sponsorData.image_url || null,
        sponsorData.video_url || null,
        sponsorData.description || null,
      ]
    );

    if (result.error) {
      return {
        success: false,
        id: null,
        error: result.error,
      };
    }

    // Get the inserted ID from the result
    const insertResult = result.data as any;
    const insertId = insertResult.insertId || null;

    // Return a serialized version of the result
    return {
      success: true,
      id: insertId,
      error: null,
    };
  } catch (error) {
    console.error("Error creating sponsor:", error);
    return {
      success: false,
      id: null,
      error:
        error instanceof Error ? error.message : "Failed to create sponsor",
    };
  }
}

export async function updateSponsor(id: number, sponsorData: Partial<Sponsor>) {
  try {
    const result = await query(
      `UPDATE Sponsors SET 
        name = ?, 
        contact_email = ?, 
        contact_phone = ?, 
        website_url = ?, 
        image_url = ?, 
        video_url = ?, 
        description = ?
      WHERE id = ?`,
      [
        sponsorData.name,
        sponsorData.contact_email || null,
        sponsorData.contact_phone || null,
        sponsorData.website_url || null,
        sponsorData.image_url || null,
        sponsorData.video_url || null,
        sponsorData.description || null,
        id,
      ]
    );

    // Return a serialized version of the result
    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error(`Error updating sponsor with ID ${id}:`, error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update sponsor",
    };
  }
}

export async function deleteSponsor(id: number) {
  try {
    const result = await query("DELETE FROM Sponsors WHERE id = ?", [id]);

    // Return a serialized version of the result
    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error(`Error deleting sponsor with ID ${id}:`, error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete sponsor",
    };
  }
}
