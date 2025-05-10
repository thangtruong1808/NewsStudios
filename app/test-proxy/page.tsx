"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function TestProxyPage() {
  const [imageUrl, setImageUrl] = useState("");
  const [proxyUrl, setProxyUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");

  const handleTest = async () => {
    if (!imageUrl) return;

    setLoading(true);
    setError("");

    try {
      const encodedUrl = encodeURIComponent(imageUrl);
      const proxyUrl = `/api/proxy-image?url=${encodedUrl}`;
      setProxyUrl(proxyUrl);

      // Test the proxy URL
      const response = await fetch(proxyUrl);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch image: ${response.status} ${response.statusText}`
        );
      }

      // If we get here, the proxy worked
      setResult("Proxy test successful");
      setError("");
    } catch (err) {
      console.error("Proxy test failed:", err);
      setError(err instanceof Error ? err.message : String(err));
      setResult("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Proxy API Test Page</h1>

      <div className="mb-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Test Proxy API</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image URL:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter image URL (e.g., https://srv876-files.hstgr.io/3fd7426401e9c4d8/files/public_html/Images/sample.jpeg)"
              className="flex-1 p-2 border border-gray-300 rounded-md"
            />
            <button
              onClick={handleTest}
              disabled={loading || !imageUrl}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? "Testing..." : "Test Proxy"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {proxyUrl && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Proxy URL: <span className="font-mono">{proxyUrl}</span>
            </p>
          </div>
        )}

        {proxyUrl && !error && (
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <img
              src={proxyUrl}
              alt="Proxied Image"
              width={500}
              height={300}
              className="w-full h-auto"
              onError={(e) => {
                console.error("Error loading proxied image:", e);
                setError("Failed to load the proxied image");
              }}
            />
          </div>
        )}
      </div>

      <div className="mb-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Direct Image Test</h2>

        {imageUrl && (
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <img
              src={imageUrl}
              alt="Direct Image"
              width={500}
              height={300}
              className="w-full h-auto"
              onError={(e) => {
                console.error("Error loading direct image:", e);
              }}
            />
          </div>
        )}
      </div>

      {result && <p className="mt-4 text-green-600">{result}</p>}
    </div>
  );
}
