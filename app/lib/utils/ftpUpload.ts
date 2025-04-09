"use server";

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
  process.env.NEXT_PUBLIC_SERVER_URL || "https://thang-truong.com";

// Get the domain from environment variable or use a default
const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || "thang-truong.com";

// Use the direct file server URL with the exact format required
const FILE_SERVER_URL = "https://srv876-files.hstgr.io/33f9f3e6b3a8af46/files";

/**
 * Uploads a file to the server via FTP
 * @param file The file to upload
 * @param fileName Optional custom filename (if not provided, a UUID will be generated)
 * @returns Object containing the file path and URL
 */
export async function uploadFileViaFTP(
  file: File,
  fileName: string
): Promise<{ url: string | null; error: string | null }> {
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

    // Check if Images directory exists
    console.log("Checking if Images directory exists...");
    const dirList = await client.list();
    const imagesDirExists = dirList.some(
      (item) => item.name === "Images" && item.type === 2
    );

    if (!imagesDirExists) {
      console.log("Images directory does not exist, creating it...");
      await client.ensureDir("Images");
      console.log("Images directory created");

      // Set directory permissions to 755 (rwxr-xr-x)
      try {
        console.log("Setting Images directory permissions to 755...");
        await client.send("SITE CHMOD 755 Images");
        console.log("Directory permissions set successfully");
      } catch (permError) {
        console.log("Could not set directory permissions:", permError);
      }
    } else {
      console.log("Images directory already exists");
    }

    // Navigate to the Images directory
    console.log("Navigating to Images directory...");
    await client.cd("Images");
    console.log("Directory navigation complete");

    // List directory after navigation to verify
    console.log("Current directory after navigation:");
    const afterDir = await client.list();
    console.log(afterDir.map((item) => item.name));

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.log(`File converted to buffer, size: ${buffer.length} bytes`);

    // Create a readable stream from the buffer
    const stream = Readable.from(buffer);

    // Upload the file to the Images directory
    console.log(`Uploading file to ${fileName}...`);
    await client.uploadFrom(stream, fileName);
    console.log("File upload complete");

    // Try to set file permissions to 644 (readable by everyone, writable by owner)
    try {
      console.log("Setting file permissions to 644...");
      await client.send("SITE CHMOD 644 " + fileName);
      console.log("File permissions set successfully");
    } catch (permError) {
      console.log("Could not set file permissions:", permError);
    }

    // Verify file exists after upload
    console.log("Verifying file exists after upload:");
    const finalDir = await client.list();
    const uploadedFile = finalDir.find((item) => item.name === fileName);
    console.log(
      uploadedFile ? "File found in directory" : "File not found in directory"
    );

    if (uploadedFile) {
      console.log("File details:", {
        name: uploadedFile.name,
        size: uploadedFile.size,
        type: uploadedFile.type,
        date: uploadedFile.date,
        permissions: uploadedFile.permissions,
      });
    }

    // Construct the URL for the uploaded file
    const url = `${BASE_URL}/Images/${fileName}`;

    console.log(`File uploaded successfully. URL: ${url}`);

    // Check if the file is accessible via HTTP
    try {
      console.log("Checking if file is accessible via HTTP...");
      const response = await fetch(url, { method: "HEAD" });
      console.log(`HTTP status: ${response.status}`);
      if (response.ok) {
        console.log("File is accessible via HTTP");
      } else {
        console.log("File is not accessible via HTTP");

        // Try to set more permissive permissions if file is not accessible
        try {
          console.log(
            "Attempting to set more permissive file permissions (755)..."
          );
          await client.send("SITE CHMOD 755 " + fileName);
          console.log("More permissive file permissions set successfully");

          // Check again after setting more permissive permissions
          console.log("Checking file accessibility again...");
          const retryResponse = await fetch(url, { method: "HEAD" });
          console.log(
            `HTTP status after permission change: ${retryResponse.status}`
          );
          if (retryResponse.ok) {
            console.log(
              "File is now accessible via HTTP after permission change"
            );
          } else {
            console.log(
              "File is still not accessible via HTTP after permission change"
            );
          }
        } catch (retryPermError) {
          console.log(
            "Could not set more permissive file permissions:",
            retryPermError
          );
        }
      }
    } catch (httpError) {
      console.log("Error checking HTTP accessibility:", httpError);
    }

    return { url, error: null };
  } catch (error) {
    console.error("FTP upload error:", error);
    return {
      url: null,
      error:
        error instanceof Error
          ? error.message
          : "Failed to upload file via FTP",
    };
  } finally {
    client.close();
  }
}

/**
 * Test function to upload a file via FTP
 * This can be used to diagnose FTP upload issues
 */
export async function testFTPUpload(): Promise<{
  success: boolean;
  message: string;
  filePath: string | null;
  url: string | null;
  error?: any;
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

    // Connect to the FTP server
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

    // Check if Images directory exists
    console.log("Checking if Images directory exists...");
    const dirList = await client.list();
    const imagesDirExists = dirList.some(
      (item) => item.name === "Images" && item.type === 2
    );

    if (!imagesDirExists) {
      console.log("Images directory does not exist, creating it...");
      await client.ensureDir("Images");
      console.log("Images directory created");

      // Set directory permissions to 755 (rwxr-xr-x)
      try {
        console.log("Setting Images directory permissions to 755...");
        await client.send("SITE CHMOD 755 Images");
        console.log("Directory permissions set successfully");
      } catch (permError) {
        console.log("Could not set directory permissions:", permError);
      }
    } else {
      console.log("Images directory already exists");
    }

    // Navigate to the Images directory
    console.log("Navigating to Images directory...");
    await client.cd("Images");
    console.log("Directory navigation complete");

    // List directory after navigation to verify
    console.log("Current directory after navigation:");
    const afterDir = await client.list();
    console.log(afterDir.map((item) => item.name));

    // Create a test file content
    const testContent = `This is a test file created at ${new Date().toISOString()}`;
    const fileName = `test-${uuidv4()}.txt`;
    console.log(
      `Created test file content, length: ${testContent.length} characters`
    );

    // Create a readable stream from the test content
    const stream = Readable.from(testContent);

    // Upload the test file
    console.log(`Uploading test file to ${fileName}...`);
    await client.uploadFrom(stream, fileName);
    console.log("Test file upload complete");

    // Try to set file permissions to 644 (readable by everyone, writable by owner)
    try {
      console.log("Setting file permissions to 644...");
      await client.send("SITE CHMOD 644 " + fileName);
      console.log("File permissions set successfully");
    } catch (permError) {
      console.log("Could not set file permissions:", permError);
    }

    // Verify file exists after upload
    console.log("Verifying file exists after upload:");
    const finalDir = await client.list();
    const uploadedFile = finalDir.find((item) => item.name === fileName);
    console.log(
      uploadedFile ? "File found in directory" : "File not found in directory"
    );

    if (uploadedFile) {
      console.log("File details:", {
        name: uploadedFile.name,
        size: uploadedFile.size,
        type: uploadedFile.type,
        date: uploadedFile.date,
        permissions: uploadedFile.permissions,
      });
    }

    // Generate the URL
    const url = `${BASE_URL}/Images/${fileName}`;
    console.log(`Test file accessible at: ${url}`);

    // Check if the file is accessible via HTTP
    try {
      console.log("Checking if file is accessible via HTTP...");
      const response = await fetch(url, { method: "HEAD" });
      console.log(`HTTP status: ${response.status}`);
      if (response.ok) {
        console.log("File is accessible via HTTP");
      } else {
        console.log("File is not accessible via HTTP");

        // Try to set more permissive permissions if file is not accessible
        try {
          console.log(
            "Attempting to set more permissive file permissions (755)..."
          );
          await client.send("SITE CHMOD 755 " + fileName);
          console.log("More permissive file permissions set successfully");

          // Check again after setting more permissive permissions
          console.log("Checking file accessibility again...");
          const retryResponse = await fetch(url, { method: "HEAD" });
          console.log(
            `HTTP status after permission change: ${retryResponse.status}`
          );
          if (retryResponse.ok) {
            console.log(
              "File is now accessible via HTTP after permission change"
            );
          } else {
            console.log(
              "File is still not accessible via HTTP after permission change"
            );
          }
        } catch (retryPermError) {
          console.log(
            "Could not set more permissive file permissions:",
            retryPermError
          );
        }
      }
    } catch (httpError) {
      console.log("Error checking HTTP accessibility:", httpError);
    }

    return {
      success: true,
      message: "Test file uploaded successfully via FTP",
      filePath: `/public_html/Images/${fileName}`,
      url,
    };
  } catch (error) {
    console.error("Error in FTP test upload:", error);

    let errorMessage = "Failed to upload test file via FTP";

    if (error instanceof Error) {
      if (error.message.includes("authentication")) {
        errorMessage = "FTP authentication failed. Please check credentials.";
      } else if (error.message.includes("connection")) {
        errorMessage =
          "Could not connect to FTP server. Please check host and port.";
      } else if (error.message.includes("directory")) {
        errorMessage = "Could not access or create directory on FTP server.";
      } else {
        errorMessage = `Upload failed: ${error.message}`;
      }
    }

    return {
      success: false,
      message: errorMessage,
      filePath: null,
      url: null,
      error,
    };
  } finally {
    // Close the FTP connection
    client.close();
  }
}

/**
 * Creates an index.html file in the Images directory to test accessibility
 */
export async function createIndexHtml(): Promise<{
  success: boolean;
  message: string;
  url: string | null;
  error?: any;
}> {
  const client = new Client();
  client.ftp.verbose = true; // Enable verbose logging for debugging

  try {
    // Connect to the FTP server
    console.log("Connecting to FTP server...", ftpConfig.host);
    await client.access(ftpConfig);
    console.log("Connected successfully");

    // Try to navigate to the public_html directory
    console.log("Navigating to public_html directory...");
    try {
      await client.cd("/public_html");
      console.log("Successfully navigated to public_html");
    } catch (error) {
      console.log("Could not navigate to public_html, trying root directory");
      await client.cd("/");
    }

    // Check if Images directory exists
    console.log("Checking if Images directory exists...");
    const dirList = await client.list();
    const imagesDirExists = dirList.some(
      (item) => item.name === "Images" && item.type === 2
    );

    if (!imagesDirExists) {
      console.log("Images directory does not exist, creating it...");
      await client.ensureDir("Images");
      console.log("Images directory created");

      // Set directory permissions to 755 (rwxr-xr-x)
      try {
        console.log("Setting Images directory permissions to 755...");
        await client.send("SITE CHMOD 755 Images");
        console.log("Directory permissions set successfully");
      } catch (permError) {
        console.log("Could not set directory permissions:", permError);
      }
    } else {
      console.log("Images directory already exists");
    }

    // Navigate to the Images directory
    console.log("Navigating to Images directory...");
    await client.cd("Images");
    console.log("Directory navigation complete");

    // Create an index.html file
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Images Directory</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    h1 { color: #333; }
    p { color: #666; }
  </style>
</head>
<body>
  <h1>Images Directory</h1>
  <p>This is a test page to verify that the Images directory is accessible.</p>
  <p>Created at: ${new Date().toISOString()}</p>
</body>
</html>
    `;

    // Create a readable stream from the HTML content
    const stream = Readable.from(htmlContent);

    // Upload the index.html file
    console.log("Uploading index.html file...");
    await client.uploadFrom(stream, "index.html");
    console.log("index.html file upload complete");

    // Try to set file permissions to 644 (readable by everyone, writable by owner)
    try {
      console.log("Setting file permissions to 644...");
      // Use the FTP client's built-in method for setting permissions
      await client.send("SITE CHMOD 644 index.html");
      console.log("File permissions set successfully");
    } catch (permError) {
      console.log("Could not set file permissions:", permError);
      // Continue even if setting permissions fails
    }

    // Verify file exists after upload
    console.log("Verifying file exists after upload:");
    const finalDir = await client.list();
    const uploadedFile = finalDir.find((item) => item.name === "index.html");
    console.log(
      uploadedFile ? "File found in directory" : "File not found in directory"
    );

    if (uploadedFile) {
      console.log("File details:", {
        name: uploadedFile.name,
        size: uploadedFile.size,
        type: uploadedFile.type,
        date: uploadedFile.date,
        permissions: uploadedFile.permissions,
      });
    }

    // Generate the URL
    const url = `${BASE_URL}/Images/index.html`;
    console.log(`index.html accessible at: ${url}`);

    // Check if the file is accessible via HTTP
    try {
      console.log("Checking if file is accessible via HTTP...");
      const response = await fetch(url, { method: "HEAD" });
      console.log(`HTTP status: ${response.status}`);
      if (response.ok) {
        console.log("File is accessible via HTTP");
      } else {
        console.log("File is not accessible via HTTP");
      }
    } catch (httpError) {
      console.log("Error checking HTTP accessibility:", httpError);
    }

    return {
      success: true,
      message: "index.html file created successfully",
      url,
    };
  } catch (error) {
    console.error("Error creating index.html:", error);

    let errorMessage = "Failed to create index.html file";

    if (error instanceof Error) {
      if (error.message.includes("authentication")) {
        errorMessage = "FTP authentication failed. Please check credentials.";
      } else if (error.message.includes("connection")) {
        errorMessage =
          "Could not connect to FTP server. Please check host and port.";
      } else if (error.message.includes("directory")) {
        errorMessage = "Could not access or create directory on FTP server.";
      } else {
        errorMessage = `Upload failed: ${error.message}`;
      }
    }

    return {
      success: false,
      message: errorMessage,
      url: null,
      error,
    };
  } finally {
    // Close the FTP connection
    client.close();
  }
}

/**
 * Lists all files in the Images directory
 */
export async function listImagesDirectory(): Promise<{
  success: boolean;
  message: string;
  files: Array<{
    name: string;
    size: number;
    type: number;
    date: string;
    permissions?: string;
  }> | null;
  error?: any;
}> {
  const client = new Client();
  client.ftp.verbose = true; // Enable verbose logging for debugging

  try {
    // Connect to the FTP server
    console.log("Connecting to FTP server...", ftpConfig.host);
    await client.access(ftpConfig);
    console.log("Connected successfully");

    // Try to navigate to the public_html directory
    console.log("Navigating to public_html directory...");
    try {
      await client.cd("/public_html");
      console.log("Successfully navigated to public_html");
    } catch (error) {
      console.log("Could not navigate to public_html, trying root directory");
      await client.cd("/");
    }

    // Check if Images directory exists
    console.log("Checking if Images directory exists...");
    const dirList = await client.list();
    const imagesDirExists = dirList.some(
      (item) => item.name === "Images" && item.type === 2
    );

    if (!imagesDirExists) {
      console.log("Images directory does not exist");
      return {
        success: false,
        message: "Images directory does not exist",
        files: null,
      };
    }

    // Navigate to the Images directory
    console.log("Navigating to Images directory...");
    await client.cd("Images");
    console.log("Directory navigation complete");

    // List all files in the directory
    console.log("Listing files in Images directory:");
    const files = await client.list();
    console.log(`Found ${files.length} files/directories`);

    // Log details of each file
    files.forEach((file) => {
      console.log(
        `File: ${file.name}, Size: ${file.size}, Type: ${file.type}, Date: ${file.date}`
      );
    });

    return {
      success: true,
      message: `Found ${files.length} files in the Images directory`,
      files: files.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
        date: file.date,
        permissions: file.permissions ? String(file.permissions) : undefined, // Convert UnixPermissions to string
      })),
    };
  } catch (error) {
    console.error("Error listing Images directory:", error);

    let errorMessage = "Failed to list files in Images directory";

    if (error instanceof Error) {
      if (error.message.includes("authentication")) {
        errorMessage = "FTP authentication failed. Please check credentials.";
      } else if (error.message.includes("connection")) {
        errorMessage =
          "Could not connect to FTP server. Please check host and port.";
      } else if (error.message.includes("directory")) {
        errorMessage = "Could not access Images directory on FTP server.";
      } else {
        errorMessage = `List operation failed: ${error.message}`;
      }
    }

    return {
      success: false,
      message: errorMessage,
      files: null,
      error,
    };
  } finally {
    // Close the FTP connection
    client.close();
  }
}

/**
 * Checks if a file is accessible via HTTP
 * @param url The URL of the file to check
 * @returns Object containing the success status and HTTP status code
 */
export async function checkFileAccessibility(
  url: string
): Promise<{ success: boolean; message: string; status?: number }> {
  try {
    console.log(`Checking accessibility of file at URL: ${url}`);
    const response = await fetch(url, { method: "HEAD" });
    const status = response.status;
    console.log(`HTTP Status: ${status}`);

    if (status === 200) {
      return {
        success: true,
        message: "File is accessible via HTTP",
        status,
      };
    } else {
      return {
        success: false,
        message: `File is not accessible. HTTP Status: ${status}`,
        status,
      };
    }
  } catch (error) {
    console.error("Error checking file accessibility:", error);
    return {
      success: false,
      message: `Error checking file accessibility: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}

/**
 * Creates a diagnostic HTML file in the Images directory to help troubleshoot web server issues
 */
export async function createDiagnosticHtml(): Promise<{
  success: boolean;
  message: string;
  url: string | null;
  error?: any;
}> {
  const client = new Client();
  client.ftp.verbose = true; // Enable verbose logging for debugging

  try {
    // Connect to the FTP server
    console.log("Connecting to FTP server...", ftpConfig.host);
    await client.access(ftpConfig);
    console.log("Connected successfully");

    // Try to navigate to the public_html directory
    console.log("Navigating to public_html directory...");
    try {
      await client.cd("/public_html");
      console.log("Successfully navigated to public_html");
    } catch (error) {
      console.log("Could not navigate to public_html, trying root directory");
      await client.cd("/");
    }

    // Check if Images directory exists
    console.log("Checking if Images directory exists...");
    const dirList = await client.list();
    const imagesDirExists = dirList.some(
      (item) => item.name === "Images" && item.type === 2
    );

    if (!imagesDirExists) {
      console.log("Images directory does not exist, creating it...");
      await client.ensureDir("Images");
      console.log("Images directory created");

      // Set directory permissions to 755 (rwxr-xr-x)
      try {
        console.log("Setting Images directory permissions to 755...");
        await client.send("SITE CHMOD 755 Images");
        console.log("Directory permissions set successfully");
      } catch (permError) {
        console.log("Could not set directory permissions:", permError);
      }
    } else {
      console.log("Images directory already exists");
    }

    // Navigate to the Images directory
    console.log("Navigating to Images directory...");
    await client.cd("Images");
    console.log("Directory navigation complete");

    // Create a diagnostic HTML file
    const fileName = `diagnostic-${uuidv4()}.html`;
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Diagnostic Page</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    h1 { color: #333; }
    p { color: #666; }
    .info { background-color: #f0f0f0; padding: 15px; border-radius: 5px; }
    .success { color: green; }
    .error { color: red; }
  </style>
</head>
<body>
  <h1>Diagnostic Page</h1>
  <p>This page was created at: ${new Date().toISOString()}</p>
  <p>If you can see this page, it means:</p>
  <ul>
    <li>The Images directory is accessible via the web server</li>
    <li>HTML files can be served from this directory</li>
    <li>The file permissions are set correctly</li>
  </ul>
  <div class="info">
    <h2>Server Information</h2>
    <p>This diagnostic page is located at: ${BASE_URL}/Images/${fileName}</p>
    <p>File permissions should be set to 644 or 755</p>
  </div>
</body>
</html>
    `;

    // Create a readable stream from the HTML content
    const stream = Readable.from(htmlContent);

    // Upload the diagnostic HTML file
    console.log(`Uploading diagnostic HTML file to ${fileName}...`);
    await client.uploadFrom(stream, fileName);
    console.log("Diagnostic HTML file upload complete");

    // Try to set file permissions to 644 (readable by everyone, writable by owner)
    try {
      console.log("Setting file permissions to 644...");
      await client.send("SITE CHMOD 644 " + fileName);
      console.log("File permissions set successfully");
    } catch (permError) {
      console.log("Could not set file permissions:", permError);
    }

    // Verify file exists after upload
    console.log("Verifying file exists after upload:");
    const finalDir = await client.list();
    const uploadedFile = finalDir.find((item) => item.name === fileName);
    console.log(
      uploadedFile ? "File found in directory" : "File not found in directory"
    );

    if (uploadedFile) {
      console.log("File details:", {
        name: uploadedFile.name,
        size: uploadedFile.size,
        type: uploadedFile.type,
        date: uploadedFile.date,
        permissions: uploadedFile.permissions,
      });
    }

    // Generate the URL
    const url = `${BASE_URL}/Images/${fileName}`;
    console.log(`Diagnostic HTML file accessible at: ${url}`);

    // Check if the file is accessible via HTTP
    try {
      console.log("Checking if file is accessible via HTTP...");
      const response = await fetch(url, { method: "HEAD" });
      console.log(`HTTP status: ${response.status}`);
      if (response.ok) {
        console.log("File is accessible via HTTP");
      } else {
        console.log("File is not accessible via HTTP");

        // Try to set more permissive permissions if file is not accessible
        try {
          console.log(
            "Attempting to set more permissive file permissions (755)..."
          );
          await client.send("SITE CHMOD 755 " + fileName);
          console.log("More permissive file permissions set successfully");

          // Check again after setting more permissive permissions
          console.log("Checking file accessibility again...");
          const retryResponse = await fetch(url, { method: "HEAD" });
          console.log(
            `HTTP status after permission change: ${retryResponse.status}`
          );
          if (retryResponse.ok) {
            console.log(
              "File is now accessible via HTTP after permission change"
            );
          } else {
            console.log(
              "File is still not accessible via HTTP after permission change"
            );
          }
        } catch (retryPermError) {
          console.log(
            "Could not set more permissive file permissions:",
            retryPermError
          );
        }
      }
    } catch (httpError) {
      console.log("Error checking HTTP accessibility:", httpError);
    }

    return {
      success: true,
      message: "Diagnostic HTML file created successfully",
      url,
    };
  } catch (error) {
    console.error("Error creating diagnostic HTML file:", error);

    let errorMessage = "Failed to create diagnostic HTML file";

    if (error instanceof Error) {
      if (error.message.includes("authentication")) {
        errorMessage = "FTP authentication failed. Please check credentials.";
      } else if (error.message.includes("connection")) {
        errorMessage =
          "Could not connect to FTP server. Please check host and port.";
      } else if (error.message.includes("directory")) {
        errorMessage = "Could not access or create directory on FTP server.";
      } else {
        errorMessage = `Upload failed: ${error.message}`;
      }
    }

    return {
      success: false,
      message: errorMessage,
      url: null,
      error,
    };
  } finally {
    // Close the FTP connection
    client.close();
  }
}

export async function uploadToFTP(file: File) {
  const client = new Client();

  try {
    // Log FTP configuration (excluding password)
    console.log("FTP Config:", {
      ...ftpConfig,
      password: "********",
    });

    // Connect to FTP server
    console.log(
      `Connecting to FTP server at ${ftpConfig.host}:${ftpConfig.port}...`
    );
    await client.access(ftpConfig);

    // Navigate to public_html directory
    try {
      await client.cd("/public_html");
      console.log("Navigated to /public_html directory");
    } catch (error) {
      console.log("Could not navigate to /public_html, trying root directory");
      await client.cd("/");
    }

    // Create Images directory if it doesn't exist
    try {
      await client.cd("Images");
      console.log("Navigated to Images directory");
    } catch (error) {
      console.log("Creating Images directory...");
      await client.send("MKD Images");
      await client.cd("Images");
      await client.send("SITE CHMOD 755 Images");
    }

    // Generate unique filename
    const fileExtension = file.name.split(".").pop();
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;

    // Upload file
    console.log(`Uploading file: ${uniqueFilename}`);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const stream = Readable.from(buffer);
    await client.uploadFrom(stream, uniqueFilename);

    // Construct URL using the exact format required
    const url = `${FILE_SERVER_URL}/public_html/Images/${uniqueFilename}`;
    console.log(`File uploaded successfully. URL: ${url}`);

    return { url, error: null };
  } catch (error) {
    console.error("FTP upload error:", error);
    return { url: null, error: "Failed to upload file to FTP server" };
  } finally {
    client.close();
  }
}
