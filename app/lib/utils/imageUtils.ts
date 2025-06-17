export const IMAGE_SERVER_BASE_URL =
  "https://srv876-files.hstgr.io/3fd7426401e9c4d8/files/public_html/Images";

export function constructImageUrl(imagePath: string | null): string {
  if (!imagePath) {
    return "";
  }

  // If the path is already a full URL, return it
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // Otherwise, construct the full URL
  const baseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "";
  const fullUrl = `${baseUrl}${imagePath}`;
  return fullUrl;
}

export function isBase64Image(str: string): boolean {
  return str.startsWith("data:image");
}

export function isExternalUrl(str: string): boolean {
  return str.startsWith("http");
}

const imageUtils = {
  constructImageUrl,
  isBase64Image,
  isExternalUrl,
  IMAGE_SERVER_BASE_URL,
};

export default imageUtils;
