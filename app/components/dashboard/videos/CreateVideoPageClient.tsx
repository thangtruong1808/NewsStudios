"use client";

import React from "react";
import { Article } from "@/app/lib/definition";
import VideoForm from "./VideoForm";

interface CreateVideoPageClientProps {
  articles: Pick<Article, "id" | "title">[];
}

export default function CreateVideoPageClient({
  articles,
}: CreateVideoPageClientProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
      <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
          Create New Video
        </h1>
        <VideoForm articles={articles} />
      </div>
    </div>
  );
}
