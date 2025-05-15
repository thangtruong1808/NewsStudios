"use client";

import React from "react";
import VideoForm from "./form/VideoForm";

export default function CreateVideoPageClient() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <VideoForm mode="create" />
    </div>
  );
}
