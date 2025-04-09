import { NextRequest, NextResponse } from "next/server";
import { Client } from "basic-ftp";
import { Readable, Writable } from "stream";

// FTP configuration
const ftpConfig = {
  host: process.env.FTP_HOST || "82.180.142.72",
  user: process.env.FTP_USER || "u506579725",
  password: process.env.FTP_PASSWORD || "2025Thang!@",
  secure: false,
  port: process.env.FTP_PORT ? parseInt(process.env.FTP_PORT) : 21,
};

export async function GET(request: NextRequest) {
  try {
    // Get the image URL from the query parameter
    const searchParams = request.nextUrl.searchParams;
    const imageUrl = searchParams.get("url");

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    // Extract the filename from the URL
    const urlParts = imageUrl.split("/");
    const filename = urlParts[urlParts.length - 1];

    // Connect to FTP server
    const client = new Client();
    await client.access(ftpConfig);

    // Navigate to the Images directory
    try {
      await client.cd("/public_html/Images");
    } catch (error) {
      console.error("Error navigating to Images directory:", error);
      return NextResponse.json(
        { error: "Failed to access Images directory" },
        { status: 500 }
      );
    }

    // Download the file
    try {
      const chunks: Buffer[] = [];

      // Create a custom writable stream to collect chunks
      const writable = new Writable({
        write(
          chunk: Buffer,
          encoding: string,
          callback: (error?: Error | null) => void
        ) {
          chunks.push(chunk);
          callback();
        },
      });

      // Download the file to our writable stream
      await client.downloadTo(writable, filename);

      // Close the writable stream
      writable.end();

      // Combine chunks into a single buffer
      const buffer = Buffer.concat(chunks);

      // Determine content type based on file extension
      const extension = filename.split(".").pop()?.toLowerCase();
      let contentType = "image/jpeg"; // Default
      if (extension === "png") contentType = "image/png";
      else if (extension === "gif") contentType = "image/gif";
      else if (extension === "webp") contentType = "image/webp";

      // Return the image with the correct content type
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch (error) {
      console.error("Error downloading file:", error);
      return NextResponse.json(
        { error: "Failed to download image" },
        { status: 500 }
      );
    } finally {
      client.close();
    }
  } catch (error) {
    console.error("Error proxying image:", error);
    return NextResponse.json(
      { error: "Failed to proxy image" },
      { status: 500 }
    );
  }
}
