export default function imageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  // If it's already a full URL, use it as is
  if (src.startsWith("http")) {
    return src;
  }

  // For relative URLs, construct the full URL
  const serverUrl =
    "https://srv876-files.hstgr.io/3fd7426401e9c4d8/files/public_html";
  return `${serverUrl}${src.startsWith("/") ? "" : "/"}${src}`;
}
