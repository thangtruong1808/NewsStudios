"use server";

import { query } from "../db/db";
import { Sponsor } from "../../login/login-definitions";

export async function getSponsors() {
  try {
    const sponsors = await query("SELECT * FROM Sponsors ORDER BY name ASC");
    return { data: sponsors as Sponsor[], error: null };
  } catch (error) {
    console.error("Error fetching sponsors:", error);
    return {
      data: null,
      error:
        error instanceof Error ? error.message : "Failed to fetch sponsors",
    };
  }
}

export async function getSponsorById(id: number) {
  try {
    const [sponsor] = await query("SELECT * FROM Sponsors WHERE id = ?", [id]);
    return { data: sponsor, error: null };
  } catch (error) {
    console.error(`Error fetching sponsor with ID ${id}:`, error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch sponsor",
    };
  }
}

export async function createSponsor(sponsorData: Omit<Sponsor, "id">) {
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

    // Return a serialized version of the result
    return {
      success: true,
      id: result.insertId,
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
