"use server";

import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { existsSync } from "fs";

// Base path for uploads on the server - using absolute path for Hostinger
const UPLOAD_DIR = process.env.UPLOAD_DIR || "public/Images";
// Base URL for uploaded files - using the domain URL structure
const BASE_URL = process.env.BASE_URL || "https://thang-truong.com/Images";

/**
 * Uploads a file to the server's upload directory
 * @param file The file to upload
 * @param fileName Optional custom filename (if not provided, a UUID will be generated)
 * @returns Object containing the file path and URL
 */
export async function uploadFileToServer(
  file: File,
  fileName?: string
): Promise<{
  filePath: string | null;
  url: string | null;
  error: string | null;
}> {
  try {
    // Generate a unique filename if not provided
    const uniqueFileName = fileName || `${uuidv4()}-${file.name}`;

    // Create the full path for the file
    const filePath = join(UPLOAD_DIR, uniqueFileName);

    // Ensure the upload directory exists
    if (!existsSync(UPLOAD_DIR)) {
      console.log(`Creating directory: ${UPLOAD_DIR}`);
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    // Convert File to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Write the file to the server
    console.log(`Writing file to: ${filePath}`);
    await writeFile(filePath, buffer);

    // Return the URL path for the file using the domain
    const url = `${BASE_URL}/${uniqueFileName}`;

    console.log(`File uploaded successfully to ${filePath}`);
    console.log(`File accessible at ${url}`);

    return {
      filePath,
      url,
      error: null,
    };
  } catch (error) {
    console.error("Error uploading file to server:", error);

    // Provide detailed error messages
    let errorMessage = "Failed to upload file to server";

    if (error instanceof Error) {
      if (error.message.includes("permission")) {
        errorMessage = "Permission denied. Please check server permissions.";
      } else if (error.message.includes("disk")) {
        errorMessage = "Disk space error. Please check server storage.";
      } else {
        errorMessage = `Upload failed: ${error.message}`;
      }
    }

    return {
      filePath: null,
      url: null,
      error: errorMessage,
    };
  }
}
