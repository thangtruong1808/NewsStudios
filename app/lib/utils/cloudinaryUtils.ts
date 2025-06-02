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
  deleteVideoFromCloudinary,
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
    if (!publicId) {
      return {
        success: false,
        error: "No public ID provided",
      };
    }

    const result = await deleteImageFromCloudinary(publicId);

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Failed to delete image",
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete image",
    };
  }
}

/**
 * Delete a video from Cloudinary
 * @param publicId - The public ID of the video to delete
 * @returns Promise with the deletion result
 */
export async function deleteVideo(
  publicId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!publicId) {
      return {
        success: false,
        error: "No public ID provided",
      };
    }

    const result = await deleteVideoFromCloudinary(publicId);

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Failed to delete video",
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete video",
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
  if (!url) {
    console.log("No URL provided to getPublicIdFromUrl");
    return null;
  }

  try {
    // Check if the URL contains cloudinary.com
    if (!url.includes("cloudinary.com")) {
      console.log("Not a Cloudinary URL:", url);
      return null;
    }

    // Extract the path part of the URL
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");

    // Find the upload index
    const uploadIndex = pathParts.findIndex((part) => part === "upload");
    if (uploadIndex === -1) {
      console.log("No 'upload' segment found in URL:", url);
      return null;
    }

    // Get the parts after 'upload'
    const partsAfterUpload = pathParts.slice(uploadIndex + 1);

    // Skip version number if present (v1234567890)
    const startIndex = partsAfterUpload[0]?.startsWith("v") ? 1 : 0;
    const relevantParts = partsAfterUpload.slice(startIndex);

    // Remove any transformation parameters and join the parts
    const publicIdParts = relevantParts.filter((part) => !part.includes(","));
    const publicId = publicIdParts.join("/");

    // Remove the file extension if present
    const cleanPublicId = publicId.replace(/\.[^/.]+$/, "");

    console.log("Extracted public ID:", {
      originalUrl: url,
      pathParts,
      uploadIndex,
      partsAfterUpload,
      relevantParts,
      publicIdParts,
      cleanPublicId,
    });

    return cleanPublicId;
  } catch (error) {
    console.error("Error extracting public ID:", error, "URL:", url);
    return null;
  }
}

export async function uploadToCloudinary(
  file: File,
  type: "image" | "video" = "image"
): Promise<{ success: boolean; url?: any; error?: string }> {
  try {
    // Get environment variables from .env
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    console.log("Cloudinary configuration:", {
      cloudName,
      uploadPreset,
      hasCloudName: !!cloudName,
      hasUploadPreset: !!uploadPreset,
      fileType: file.type,
      fileName: file.name,
      fileSize: file.size,
    });

    // Validate environment variables with detailed error messages
    if (!cloudName) {
      throw new Error(
        "Cloudinary cloud name is not configured. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in your .env file."
      );
    }
    if (!uploadPreset) {
      throw new Error(
        "Cloudinary upload preset is not configured. Please set NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in your .env file."
      );
    }

    // For large files (over 100MB), use chunked upload
    if (file.size > 100 * 1024 * 1024) {
      const chunkSize = 20 * 1024 * 1024; // 20MB chunks
      const totalChunks = Math.ceil(file.size / chunkSize);
      let uploadId = null;

      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const chunk = file.slice(start, end);

        const formData = new FormData();
        formData.append("file", chunk);
        formData.append("upload_preset", uploadPreset);
        formData.append("cloud_name", cloudName);
        formData.append("folder", "NewsHub");

        if (uploadId) {
          formData.append("upload_id", uploadId);
        }

        const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${type}/upload`;
        const response = await fetch(uploadUrl, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || "Upload failed");
        }

        const data = await response.json();
        if (!uploadId) {
          uploadId = data.upload_id;
        }

        if (i === totalChunks - 1) {
          return {
            success: true,
            url: data.secure_url,
          };
        }
      }
    }

    // For smaller files, use regular upload
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("cloud_name", cloudName);
    formData.append("folder", "NewsHub");

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${type}/upload`;
    console.log("Uploading to:", uploadUrl);

    const response = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Cloudinary upload error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });

      // Handle specific Cloudinary errors
      if (errorData.error?.message?.includes("Upload preset")) {
        throw new Error(
          `Upload preset "${uploadPreset}" not found in your Cloudinary account. Please verify the preset name in your Cloudinary dashboard.`
        );
      }
      throw new Error(errorData.error?.message || "Upload failed");
    }

    const data = await response.json();
    return {
      success: true,
      url: data.secure_url,
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload file",
    };
  }
}
