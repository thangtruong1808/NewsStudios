"use client";

import { useState, useEffect } from "react";

export default function TestCategoriesPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/test-categories");
        const data = await response.json();
        setResult(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Categories Table Test</h1>

      {loading ? (
        <div className="p-4 bg-gray-50 rounded-md">
          <p className="text-gray-600">Loading...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 rounded-md">
          <h2 className="text-lg font-semibold text-red-800">Error</h2>
          <p className="mt-2 text-sm text-red-700">{error}</p>
        </div>
      ) : (
        <div
          className={`p-4 rounded-md ${
            result?.success ? "bg-green-50" : "bg-red-50"
          }`}
        >
          <h2
            className={`text-lg font-semibold ${
              result?.success ? "text-green-800" : "text-red-800"
            }`}
          >
            {result?.success ? "Test Successful" : "Test Failed"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">{result?.message}</p>

          {result?.error && (
            <div className="mt-4 p-3 bg-red-100 rounded-md">
              <p className="text-sm font-medium text-red-800">Error:</p>
              <p className="mt-1 text-sm text-red-700">{result.error}</p>
            </div>
          )}

          {result?.data && (
            <div className="mt-4 p-3 bg-green-100 rounded-md">
              <p className="text-sm font-medium text-green-800">
                Categories ({result.count}):
              </p>
              <div className="mt-2 overflow-auto max-h-96">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {result.data.map((category: any) => (
                      <tr key={category.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {category.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {category.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {category.description || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
