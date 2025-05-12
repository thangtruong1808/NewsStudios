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
    <div className="mx-auto max-w-4xl px-4 py-8">
      <VideoForm articles={articles} />
    </div>
  );
}
