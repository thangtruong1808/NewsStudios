"use server";

import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload an image to Cloudinary using server-side action
 * @param base64String - The base64 string of the image to upload
 * @returns Promise with the upload result
 */
export async function uploadImageToCloudinary(base64String: string) {
  try {
    // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${base64Data}`,
      {
        resource_type: "image",
        folder: "advertisements",
      }
    );

    return { url: result.secure_url, error: null };
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    return { url: null, error: "Failed to upload image" };
  }
}

/**
 * Upload a video to Cloudinary using server-side action
 * @param base64String - The base64 string of the video to upload
 * @returns Promise with the upload result
 */
export async function uploadVideoToCloudinary(base64String: string) {
  try {
    // Remove the data URL prefix (e.g., "data:video/mp4;base64,")
    const base64Data = base64String.replace(/^data:video\/\w+;base64,/, "");

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(
      `data:video/mp4;base64,${base64Data}`,
      {
        resource_type: "video",
        folder: "advertisements",
      }
    );

    return { url: result.secure_url, error: null };
  } catch (error) {
    console.error("Error uploading video to Cloudinary:", error);
    return { url: null, error: "Failed to upload video" };
  }
}

/**
 * Delete an image from Cloudinary using server-side action
 * @param publicId - The public ID of the image to delete
 * @returns Promise with the deletion result
 */
export async function deleteImageFromCloudinary(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return { success: true, result };
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete image",
    };
  }
}
