import React from "react";
import { Suspense } from "react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function Loading() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<Loading />}>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
        <p className="text-gray-600">
          Select an option from the sidebar to get started.
        </p>
      </div>
    </Suspense>
  );
}
