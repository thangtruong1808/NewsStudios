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

// Get FTP configuration from environment variables or use hardcoded values
const ftpConfig: FTPConfig = {
  host: process.env.FTP_HOST || "82.180.142.72",
  user: process.env.FTP_USER || "u506579725",
  password: process.env.FTP_PASSWORD || "2025Thang!@",
  secure: false,
  port: process.env.FTP_PORT ? parseInt(process.env.FTP_PORT) : 21,
};

// Base URL for uploaded files
const BASE_URL =
  "https://srv876-files.hstgr.io/3fd7426401e9c4d8/files/public_html";

// Get the domain from environment variable or use a default
const DOMAIN = "srv876-files.hstgr.io";

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
  client.ftp.verbose = true; // Enable verbose logging for debugging

  try {
    // Log FTP configuration (without password)
    console.log("FTP Configuration:", {
      host: ftpConfig.host,
      user: ftpConfig.user,
      secure: ftpConfig.secure,
      port: ftpConfig.port,
    });

    // Connect to FTP server
    console.log(
      `Connecting to FTP server at ${ftpConfig.host}:${ftpConfig.port}...`
    );
    await client.access(ftpConfig);
    console.log("Connected successfully");

    // List current directory to verify location
    console.log("Current directory before navigation:");
    const currentDir = await client.list();
    console.log(currentDir.map((item) => item.name));

    // Try to navigate to the public_html directory
    console.log("Navigating to public_html directory...");
    try {
      await client.cd("/public_html");
      console.log("Successfully navigated to public_html");
    } catch (error) {
      console.log("Could not navigate to public_html, trying root directory");
      await client.cd("/");
    }

    // Determine the target directory based on file type
    const targetDir = type === "image" ? "Images" : "Videos";

    // Check if target directory exists
    console.log(`Checking if ${targetDir} directory exists...`);
    const dirList = await client.list();
    const targetDirExists = dirList.some(
      (item) => item.name === targetDir && item.type === 2
    );

    if (!targetDirExists) {
      console.log(`${targetDir} directory does not exist, creating it...`);
      await client.ensureDir(targetDir);
      console.log(`${targetDir} directory created`);

      // Set directory permissions to 755 (rwxr-xr-x)
      try {
        console.log(`Setting ${targetDir} directory permissions to 755...`);
        await client.send(`SITE CHMOD 755 ${targetDir}`);
        console.log("Directory permissions set successfully");
      } catch (permError) {
        console.log("Could not set directory permissions:", permError);
      }
    } else {
      console.log(`${targetDir} directory already exists`);
    }

    // Navigate to the target directory
    await client.cd(targetDir);
    console.log(`Navigated to ${targetDir} directory`);

    // Generate a unique filename if not provided
    const fileExtension = file.name.split(".").pop() || "";
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;

    // Convert File to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create a readable stream from the buffer
    const stream = Readable.from(buffer);

    // Upload the file
    console.log(`Uploading file ${uniqueFileName}...`);
    await client.uploadFrom(stream, uniqueFileName);
    console.log(`File ${uniqueFileName} uploaded successfully`);

    // Set file permissions to 644 (rw-r--r--)
    try {
      console.log(`Setting file permissions to 644...`);
      await client.send(`SITE CHMOD 644 ${uniqueFileName}`);
      console.log("File permissions set successfully");
    } catch (permError) {
      console.log("Could not set file permissions:", permError);
    }

    // Construct the URL for the uploaded file
    const fileUrl = `${FILE_SERVER_URL}/${targetDir}/${uniqueFileName}`;
    console.log(`File accessible at ${fileUrl}`);

    return {
      filePath: `${targetDir}/${uniqueFileName}`,
      url: fileUrl,
      error: null,
    };
  } catch (error) {
    console.error("Error uploading file to FTP server:", error);

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
  client.ftp.verbose = true;

  try {
    // Connect to FTP server
    console.log(
      `Connecting to FTP server at ${ftpConfig.host}:${ftpConfig.port}...`
    );
    await client.access(ftpConfig);
    console.log("Connected successfully");

    // Create a small test file
    const testContent = "This is a test file for FTP connection.";
    const testFileName = `test-${uuidv4()}.txt`;

    // Create a readable stream from the test content
    const stream = Readable.from(testContent);

    // Upload the test file
    console.log(`Uploading test file ${testFileName}...`);
    await client.uploadFrom(stream, testFileName);
    console.log(`Test file ${testFileName} uploaded successfully`);

    // Construct the URL for the test file
    const fileUrl = `${FILE_SERVER_URL}/${testFileName}`;

    return {
      success: true,
      message: "FTP connection test successful",
      filePath: testFileName,
      url: fileUrl,
    };
  } catch (error) {
    console.error("FTP connection test failed:", error);
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
