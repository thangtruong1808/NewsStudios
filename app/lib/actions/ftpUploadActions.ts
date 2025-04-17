"use server";

import {
  testFTPUpload,
  uploadFileViaFTP,
  createIndexHtml,
  listImagesDirectory,
  checkFileAccessibility,
  createDiagnosticHtml,
} from "../utils/ftpUpload";

export async function testFTPConnection() {
  try {
    return await testFTPUpload();
  } catch (error) {
    console.error("Error in testFTPConnection server action:", error);
    return {
      success: false,
      message: "Error testing FTP connection",
      filePath: null,
      url: null,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function uploadFileToFTP(file: File, fileName: string) {
  try {
    return await uploadFileViaFTP(file, fileName);
  } catch (error) {
    console.error("Error in uploadFileToFTP server action:", error);
    return {
      url: null,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function createIndexHtmlFile() {
  try {
    return await createIndexHtml();
  } catch (error) {
    console.error("Error in createIndexHtmlFile server action:", error);
    return {
      success: false,
      message: "Error creating index.html file",
      url: null,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function listImagesDir() {
  try {
    return await listImagesDirectory();
  } catch (error) {
    console.error("Error in listImagesDir server action:", error);
    return {
      success: false,
      message: "Error listing images directory",
      files: null,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function checkFileAccess(url: string) {
  try {
    return await checkFileAccessibility(url);
  } catch (error) {
    console.error("Error in checkFileAccess server action:", error);
    return {
      success: false,
      message: "Error checking file accessibility",
      status: undefined,
    };
  }
}

export async function createDiagnosticHtmlFile() {
  try {
    return await createDiagnosticHtml();
  } catch (error) {
    console.error("Error in createDiagnosticHtmlFile server action:", error);
    return {
      success: false,
      message: "Error creating diagnostic HTML file",
      url: null,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
