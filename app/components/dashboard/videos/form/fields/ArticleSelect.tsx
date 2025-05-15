"use client";

import { Article } from "@/app/lib/definition";

interface ArticleSelectProps {
  value: number;
  onChange: (value: number) => void;
}

export default function ArticleSelect({ value, onChange }: ArticleSelectProps) {
  return (
    <div>
      <label
        htmlFor="article_id"
        className="block text-sm font-medium text-gray-700"
      >
        Article
      </label>
      <div className="mt-2">
        <select
          id="article_id"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
        >
          <option value={0}>Select an article (optional)</option>
          {/* Articles will be populated from parent component */}
        </select>
      </div>
    </div>
  );
}
