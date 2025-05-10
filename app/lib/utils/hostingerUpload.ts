"use server";

import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Base path for uploads on the server - using absolute path for Hostinger
const UPLOAD_DIR = "/home/u123456789/domains/yourdomain.com/public_html/Images";

/**
 * Uploads a file to the server's upload directory
 * @param file The file to upload
 * @param fileName Optional custom filename (if not provided, a UUID will be generated)
 * @returns Object containing the file path and URL
 */
export async function uploadToHostinger(
  file: File | Blob,
  fileName: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // Create directory if it doesn't exist
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    // Generate unique filename
    const uniqueFileName = `${uuidv4()}-${fileName}`;
    const filePath = path.join(UPLOAD_DIR, uniqueFileName);

    // Convert File/Blob to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Write file to disk
    fs.writeFileSync(filePath, buffer);

    // Construct URL
    const url = `https://yourdomain.com/Images/${uniqueFileName}`;

    return { success: true, url };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
