export const IMAGE_SERVER_BASE_URL =
  "https://srv876-files.hstgr.io/3fd7426401e9c4d8/files/public_html/Images";

export function constructImageUrl(imagePath: string): string {
  if (!imagePath) return "";

  // If it's already a full URL, return it as is
  if (imagePath.startsWith("http")) return imagePath;

  // If it's a base64 image, return it as is
  if (imagePath.startsWith("data:")) return imagePath;

  // If it's a local path (starts with /), remove the leading slash
  const cleanPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;

  // Construct the full URL
  const fullUrl = `${IMAGE_SERVER_BASE_URL}/${cleanPath}`;

  // Log the URL construction for debugging
  console.log(`Constructing image URL: ${imagePath} -> ${fullUrl}`);

  return fullUrl;
}

export function isBase64Image(str: string): boolean {
  return str.startsWith("data:image");
}

export function isExternalUrl(str: string): boolean {
  return str.startsWith("http");
}

// Export a default object with all functions
export default {
  constructImageUrl,
  isBase64Image,
  isExternalUrl,
  IMAGE_SERVER_BASE_URL,
};
