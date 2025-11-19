"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function TestUpload() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const testUpload = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/test-upload");
      const data = await response.json();
      setResult(data);

      if (data.success) {
        toast.success("Test file uploaded successfully!");
      } else {
        toast.error(`Upload failed: ${data.message}`);
      }
    } catch {
      toast.error("Failed to test upload");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Test File Upload</h2>
      <p className="mb-4 text-gray-600">
        This will create a test file on your server to verify upload
        functionality.
      </p>

      <button
        onClick={testUpload}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Testing..." : "Test Upload"}
      </button>

      {result && (
        <div className="mt-6 p-4 border rounded">
          <h3 className="font-medium mb-2">Result:</h3>
          <pre className="bg-gray-100 p-3 rounded overflow-auto text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>

          {result.url && (
            <div className="mt-4">
              <p className="font-medium">Test File URL:</p>
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {result.url}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
