"use server";

import { v2 as cloudinary } from "cloudinary";

// Log environment variables for debugging (without exposing sensitive values)
console.log("Cloudinary environment check:", {
  hasCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
  hasApiKey: !!process.env.CLOUDINARY_API_KEY,
  hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
  secure: true,
});

/**
 * Upload an image to Cloudinary from a server action
 * @param file - The file to upload
 * @param folder - The folder to upload to (optional)
 * @returns Promise with the upload result
 */
export async function uploadImageToCloudinary(
  file: File,
  folder: string = "portfolio"
): Promise<{
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
}> {
  try {
    // Check if Cloudinary is properly configured
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      throw new Error("Cloudinary cloud_name is not configured");
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log(
      `Uploading file to Cloudinary: ${file.name}, size: ${file.size} bytes, folder: ${folder}`
    );

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error details:", error);
            reject(error);
          } else {
            console.log("Cloudinary upload successful:", result);
            resolve(result);
          }
        }
      );

      // Create a stream from the buffer
      const stream = require("stream");
      const bufferStream = new stream.PassThrough();
      bufferStream.end(buffer);
      bufferStream.pipe(uploadStream);
    });

    return {
      success: true,
      url: (result as any).secure_url,
      publicId: (result as any).public_id,
    };
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to upload image to Cloudinary",
    };
  }
}

/**
 * Delete an image from Cloudinary
 * @param publicId - The public ID of the image to delete
 * @returns Promise with the deletion result
 */
export async function deleteImageFromCloudinary(
  publicId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if Cloudinary is properly configured
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      throw new Error("Cloudinary cloud_name is not configured");
    }

    const result = await cloudinary.uploader.destroy(publicId);
    return { success: true };
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to delete image from Cloudinary",
    };
  }
}
