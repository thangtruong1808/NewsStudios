"use client";

import { useState } from "react";
import ImageTest from "../../../components/dashboard/photos/ImageTest";

export default function ImageTestPage() {
  const [imageUrl, setImageUrl] = useState(
    "b1150b70-a998-49ea-a8c1-dbb2b6e0e918.jpg"
  );
  const [customUrl, setCustomUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl) {
      setImageUrl(customUrl);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Image Loading Test</h1>

      <div className="bg-white p-4 rounded-md shadow">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="Enter image filename or full URL"
            className="flex-1 p-2 border rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Test
          </button>
        </form>

        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Current image: <span className="font-mono">{imageUrl}</span>
          </p>
        </div>
      </div>

      <ImageTest imageUrl={imageUrl} />
    </div>
  );
}
