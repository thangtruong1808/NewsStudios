"use client";

import React from "react";
import VideoForm from "../../../components/dashboard/videos/VideoForm";

export default function CreateVideoPage() {
  return (
    <div className="space-y-4">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">Upload Video Form</h1>
      </div>
      <VideoForm />
    </div>
  );
}
