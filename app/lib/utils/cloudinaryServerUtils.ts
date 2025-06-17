"use server";

import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "",
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
  folder: string = "NewsHub"
): Promise<{
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
}> {
  try {
    // Check if Cloudinary is properly configured
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
      console.error("Cloudinary configuration missing: cloud_name");
      throw new Error("Cloudinary cloud_name is not configured");
    }

    if (!process.env.CLOUDINARY_API_KEY) {
      console.error("Cloudinary configuration missing: api_key");
      throw new Error("Cloudinary api_key is not configured");
    }

    if (!process.env.CLOUDINARY_API_SECRET) {
      console.error("Cloudinary configuration missing: api_secret");
      throw new Error("Cloudinary api_secret is not configured");
    }

    // Validate file
    if (!file || !file.name) {
      throw new Error("Invalid file: File is missing or has no name");
    }

    console.log(
      `Uploading file to Cloudinary: ${file.name}, size: ${file.size} bytes, type: ${file.type}, folder: ${folder}`
    );

    // Convert file to buffer
    let buffer: Buffer;
    try {
      const bytes = await file.arrayBuffer();
      buffer = Buffer.from(bytes);
      console.log(`File converted to buffer: ${buffer.length} bytes`);
    } catch (error) {
      console.error("Error converting file to buffer:", error);
      throw new Error(
        `Failed to process file: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }

    // Determine resource type based on file type
    let resourceType: "image" | "video" | "auto" | "raw" = "auto";
    if (file.type.startsWith("image/")) {
      resourceType = "image";
    } else if (file.type.startsWith("video/")) {
      resourceType = "video";
    }

    console.log(`Resource type determined: ${resourceType}`);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      try {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: folder,
            resource_type: resourceType,
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error details:", error);
              reject(error);
            } else {
              console.log("Cloudinary upload successful:", {
                public_id: (result as any).public_id,
                format: (result as any).format,
                resource_type: (result as any).resource_type,
              });
              resolve(result);
            }
          }
        );

        // Create a stream from the buffer
        const stream = require("stream");
        const bufferStream = new stream.PassThrough();
        bufferStream.end(buffer);
        bufferStream.pipe(uploadStream);
      } catch (error) {
        console.error("Error setting up upload stream:", error);
        reject(error);
      }
    });

    return {
      success: true,
      url: (result as any).secure_url,
      publicId: (result as any).public_id,
    };
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to upload file to Cloudinary",
    };
  }
}

/**
 * Delete an image from Cloudinary
 * @param publicId - The public ID of the image to delete
 * @returns Promise with the deletion result
 */
export async function deleteImageFromCloudinary(publicId: string) {
  try {
    if (!publicId) {
      throw new Error("Public ID is required for deletion");
    }

    const cleanPublicId = publicId.split(".")[0];
    const fullPublicId = cleanPublicId.includes("newshub_photos/")
      ? cleanPublicId
      : `newshub_photos/${cleanPublicId}`;

    const _result = await new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(
        fullPublicId,
        { resource_type: "image", invalidate: true },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
    });

    return {
      success: true,
      message: `Successfully deleted image: ${fullPublicId}`,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to delete image from Cloudinary",
      details: {
        publicId,
        timestamp: new Date().toISOString(),
      },
    };
  }
}

/**
 * Delete a video from Cloudinary
 * @param publicId - The public ID of the video to delete
 * @returns Promise with the deletion result
 */
export async function deleteVideoFromCloudinary(publicId: string) {
  try {
    if (!publicId) {
      throw new Error("Public ID is required for deletion");
    }

    const cleanPublicId = publicId.split(".")[0];
    const fullPublicId = cleanPublicId.includes("newshub_photos/")
      ? cleanPublicId
      : `newshub_photos/${cleanPublicId}`;

    const _result = await new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(
        fullPublicId,
        { resource_type: "video", invalidate: true },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
    });

    return {
      success: true,
      message: `Successfully deleted video: ${fullPublicId}`,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to delete video from Cloudinary",
      details: {
        publicId,
        timestamp: new Date().toISOString(),
      },
    };
  }
}
