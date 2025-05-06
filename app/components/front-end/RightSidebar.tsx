"use client";

import { useState, useEffect } from "react";
import { getTags } from "@/app/lib/actions/tags";
import { Tag } from "@/app/lib/definition";

export default function RightSidebar() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const result = await getTags();
        if (result.error) {
          throw new Error(result.error);
        }
        if (result.data) {
          setTags(result.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch tags");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTags();
  }, []);

  return (
    <div className="w-64 min-h-screen bg-gradient-to-b from-emerald-900 to-emerald-800 p-6 text-white">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Trending Tags</h3>
          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            </div>
          ) : error ? (
            <p className="text-sm text-emerald-200">{error}</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-3 py-1 rounded-full text-sm bg-emerald-800/50 hover:bg-emerald-800 transition-colors duration-300"
                  style={{ borderColor: tag.color || "#10B981" }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
