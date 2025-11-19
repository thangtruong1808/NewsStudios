"use server";

import { uploadToFTP } from "../utils/ftp";

/**
 * Server action to upload a file to the FTP server
 * @param file The file to upload
 * @param type The type of file (image/video)
 * @returns Object containing the file path and URL
 */
export async function uploadFile(
  file: File,
  type: "image" | "video" = "image"
) {
  try {
    const result = await uploadToFTP(file, type);
    return result;
  } catch (error) {
    return {
      filePath: null,
      url: null,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
