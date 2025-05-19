import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
  secure: true,
});

export async function POST(request: Request) {
  try {
    const { publicId } = await request.json();

    if (!publicId) {
      return NextResponse.json(
        { success: false, error: "No public ID provided" },
        { status: 400 }
      );
    }

    // Remove the version prefix if it exists
    const cleanPublicId = publicId.replace(/^v\d+\//, "");
    console.log(
      "Attempting to delete image with clean public ID:",
      cleanPublicId
    );

    // Use synchronous version of destroy
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(
        cleanPublicId,
        { invalidate: true },
        (error, result) => {
          if (error) {
            console.error("Cloudinary delete error:", error);
            reject(error);
            return;
          }
          resolve(result);
        }
      );
    });

    if (!result || (result as any).result !== "ok") {
      throw new Error("Failed to delete image from Cloudinary");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in delete API route:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to delete image",
      },
      { status: 500 }
    );
  }
}
