"use client";

// Remove the cloudinary import and configuration
// import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with your credentials
// cloudinary.config({
//   cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
//   secure: true,
// });

// Import the server actions
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} from "./cloudinaryServerUtils";

/**
 * Upload an image to Cloudinary
 * @param file - The file to upload (File object or base64 string)
 * @param folder - The folder to upload to (optional)
 * @returns Promise with the upload result
 */
export async function uploadImage(
  file: File | string,
  folder?: string
): Promise<{
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
}> {
  try {
    let fileToUpload: File;

    if (typeof file === "string") {
      // If it's a base64 string, convert it to a File object
      const response = await fetch(file);
      const blob = await response.blob();
      const fileName = "image.jpg";
      fileToUpload = new File([blob], fileName, { type: blob.type });
    } else {
      fileToUpload = file;
    }

    // Use the server action to upload the image
    const result = await uploadImageToCloudinary(fileToUpload, folder);

    if (!result.success) {
      throw new Error(result.error || "Failed to upload image");
    }

    return {
      success: true,
      url: result.url,
      publicId: result.publicId,
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload image",
    };
  }
}

/**
 * Delete an image from Cloudinary
 * @param publicId - The public ID of the image to delete
 * @returns Promise with the deletion result
 */
export async function deleteImage(
  publicId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Use the server action to delete the image
    const result = await deleteImageFromCloudinary(publicId);

    if (!result.success) {
      throw new Error(result.error || "Failed to delete image");
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting image:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete image",
    };
  }
}

/**
 * Get a transformed URL for an image
 * @param publicId - The public ID of the image
 * @param options - Transformation options
 * @returns The transformed URL
 */
export function getImageUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: number;
    format?: string;
  } = {}
) {
  const {
    width,
    height,
    crop = "fill",
    quality = "auto",
    format = "auto",
  } = options;

  // Construct the URL manually instead of using the SDK
  let url = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;

  // Add transformation parameters
  const params = [];
  if (width) params.push(`w_${width}`);
  if (height) params.push(`h_${height}`);
  if (crop) params.push(`c_${crop}`);
  if (quality) params.push(`q_${quality}`);
  if (format) params.push(`f_${format}`);

  if (params.length > 0) {
    url += `/${params.join(",")}`;
  }

  // Add the public ID
  url += `/${publicId}`;

  return url;
}

/**
 * Check if a URL is from Cloudinary
 * @param url - The URL to check
 * @returns Boolean indicating if the URL is from Cloudinary
 */
export function isCloudinaryUrl(url: string): boolean {
  if (!url) return false;

  // Check if the URL contains cloudinary.com
  return url.includes("cloudinary.com");
}

/**
 * Extract the public ID from a Cloudinary URL
 * @param url - The Cloudinary URL
 * @returns The public ID or null if not a valid Cloudinary URL
 */
export function getPublicIdFromUrl(url: string): string | null {
  if (!isCloudinaryUrl(url)) {
    return null;
  }

  try {
    // Extract the path part of the URL
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");

    // Find the upload index
    const uploadIndex = pathParts.findIndex((part) => part === "upload");
    if (uploadIndex === -1) {
      return null;
    }

    // The public ID is everything after the upload part
    const publicId = pathParts.slice(uploadIndex + 1).join("/");

    // Remove the file extension if present
    return publicId.replace(/\.[^/.]+$/, "");
  } catch (error) {
    console.error("Error extracting public ID:", error);
    return null;
  }
}
