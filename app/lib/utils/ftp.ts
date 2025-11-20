// "use server";

import { Client } from "basic-ftp";
import { v4 as uuidv4 } from "uuid";
import { Readable } from "stream";

interface FTPConfig {
  host: string;
  user: string;
  password: string;
  secure: boolean;
  port?: number;
}

// Component Info
// Description: FTP utility functions for file uploads to remote server.
// Date updated: 2025-November-21
// Author: thangtruong

// Get FTP configuration from environment variables
const ftpConfig: FTPConfig = {
  host: process.env.FTP_HOST || "",
  user: process.env.FTP_USER || "",
  password: process.env.FTP_PASSWORD || "",
  secure: false,
  port: process.env.FTP_PORT ? parseInt(process.env.FTP_PORT) : 21,
};

// Use the direct file server URL with the exact format required
export const FILE_SERVER_URL =
  "https://srv876-files.hstgr.io/3fd7426401e9c4d8/files";

/**
 * Uploads a file to the server via FTP
 * @param file The file to upload
 * @param type The type of file (image/video)
 * @returns Object containing the file path and URL
 */
export async function uploadToFTP(
  file: File,
  type: "image" | "video" = "image"
): Promise<{
  filePath: string | null;
  url: string | null;
  error: string | null;
}> {
  const client = new Client();

  try {
    // Connect to FTP server
    await client.access(ftpConfig);

    // Try to navigate to the public_html directory
    try {
      await client.cd("/public_html");
    } catch {
      await client.cd("/");
    }

    // Determine the target directory based on file type
    const targetDir = type === "image" ? "Images" : "Videos";

    // Check if target directory exists
    const dirList = await client.list();
    const targetDirExists = dirList.some(
      (item) => item.name === targetDir && item.type === 2
    );

    if (!targetDirExists) {
      await client.ensureDir(targetDir);

      // Set directory permissions to 755 (rwxr-xr-x)
      try {
        await client.send(`SITE CHMOD 755 ${targetDir}`);
      } catch {
        // Ignore permission errors
      }
    }

    // Navigate to the target directory
    await client.cd(targetDir);

    // Generate a unique filename if not provided
    const fileExtension = file.name.split(".").pop() || "";
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;

    // Convert File to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create a readable stream from the buffer
    const stream = Readable.from(buffer);

    // Upload the file
    await client.uploadFrom(stream, uniqueFileName);

    // Set file permissions to 644 (rw-r--r--)
    try {
      await client.send(`SITE CHMOD 644 ${uniqueFileName}`);
    } catch {
      // Ignore permission errors
    }

    // Construct the URL for the uploaded file
    const fileUrl = `${FILE_SERVER_URL}/${targetDir}/${uniqueFileName}`;

    return {
      filePath: `${targetDir}/${uniqueFileName}`,
      url: fileUrl,
      error: null,
    };
  } catch (error) {

    // Provide detailed error messages
    let errorMessage = "Failed to upload file to FTP server";

    if (error instanceof Error) {
      if (error.message.includes("permission")) {
        errorMessage =
          "Permission denied. Please check FTP server permissions.";
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
  } finally {
    // Close the FTP connection
    client.close();
  }
}

/**
 * Tests the FTP connection and uploads a small test file
 * @returns Object containing the test results
 */
export async function testFTPConnection(): Promise<{
  success: boolean;
  message: string;
  filePath: string | null;
  url: string | null;
  error?: any;
}> {
  const client = new Client();

  try {
    // Connect to FTP server
    await client.access(ftpConfig);

    // Create a small test file
    const testContent = "This is a test file for FTP connection.";
    const testFileName = `test-${uuidv4()}.txt`;

    // Create a readable stream from the test content
    const stream = Readable.from(testContent);

    // Upload the test file
    await client.uploadFrom(stream, testFileName);

    // Construct the URL for the test file
    const fileUrl = `${FILE_SERVER_URL}/${testFileName}`;

    return {
      success: true,
      message: "FTP connection test successful",
      filePath: testFileName,
      url: fileUrl,
    };
  } catch (error) {
    return {
      success: false,
      message: "FTP connection test failed",
      filePath: null,
      url: null,
      error,
    };
  } finally {
    // Close the FTP connection
    client.close();
  }
}
