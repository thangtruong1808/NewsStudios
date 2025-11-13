"use client";

import { Toaster } from "react-hot-toast";

// Component Info
// Description: Global toaster provider configuring default toast behavior across the app.
// Data created: Shared Toaster instance with consistent styling and durations.
// Author: thangtruong

export default function ToasterProvider() {
  return <Toaster position="bottom-left" />;
}
