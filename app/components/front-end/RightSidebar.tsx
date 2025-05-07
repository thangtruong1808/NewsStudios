"use client";

import { useState, useEffect } from "react";
import { getTags } from "@/app/lib/actions/tags";
import { Tag } from "@/app/lib/definition";
import { TagIcon } from "@heroicons/react/24/outline";

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
    <div className="w-64 bg-stone-200 text-white p-2 justify-around rounded-lg p-3">
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-emerald-500 mb-5">
            Trending Tags
          </h3>
          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            </div>
          ) : error ? (
            <p className="text-sm text-emerald-200">{error}</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-800 text-zinc-100 rounded-full text-sm font-medium transition-colors duration-200"
                >
                  <TagIcon className="h-4 w-4" />
                  {tag.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
