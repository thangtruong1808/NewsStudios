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
    console.log("Starting uploadImage function with:", {
      fileType: typeof file,
      isFile: file instanceof File,
      folder,
    });

    let fileToUpload: File;

    if (typeof file === "string") {
      // If it's a base64 string, convert it to a File object
      try {
        console.log("Converting string to File object");
        const response = await fetch(file);
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.statusText}`);
        }
        const blob = await response.blob();
        const fileName = "image.jpg";
        fileToUpload = new File([blob], fileName, { type: blob.type });
        console.log("Successfully converted string to File object");
      } catch (error) {
        console.error("Error converting string to File:", error);
        throw new Error("Failed to process image data");
      }
    } else {
      fileToUpload = file;
      console.log("Using provided File object:", {
        name: fileToUpload.name,
        size: fileToUpload.size,
        type: fileToUpload.type,
      });
    }

    // Validate file type
    const fileType = fileToUpload.type;
    const isImage = fileType.startsWith("image/");
    const isVideo = fileType.startsWith("video/");

    console.log("File validation:", {
      fileType,
      isImage,
      isVideo,
    });

    if (!isImage && !isVideo) {
      throw new Error(
        `Unsupported file type: ${fileType}. Only images and videos are supported.`
      );
    }

    // Use the server action to upload the image
    console.log("Calling server action uploadImageToCloudinary");
    const result = await uploadImageToCloudinary(fileToUpload, folder);
    console.log("Server action result:", result);

    if (!result.success) {
      throw new Error(result.error || "Failed to upload file to Cloudinary");
    }

    return {
      success: true,
      url: result.url,
      publicId: result.publicId,
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload file",
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
