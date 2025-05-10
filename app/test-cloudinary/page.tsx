"use client";

import { useState } from "react";
import { uploadImageToCloudinary } from "@/app/lib/actions/cloudinary";

export default function TestCloudinary() {
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError("");
    setResult("");

    try {
      // Convert file to base64
      const base64String = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const result = await uploadImageToCloudinary(base64String);

      if (result.error) {
        throw new Error(result.error);
      }

      if (!result.url) {
        throw new Error("No URL returned from Cloudinary");
      }

      setResult(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Cloudinary Upload Test</h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4"
        disabled={loading}
      />
      {loading && <p>Uploading...</p>}
      {result && (
        <div className="mt-4">
          <p className="text-green-600">Upload successful!</p>
          <img src={result} alt="Uploaded" className="mt-2 max-w-md" />
        </div>
      )}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
}
