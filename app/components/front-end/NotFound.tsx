"use client";

import { FireIcon } from "@heroicons/react/24/outline";

interface NotFoundProps {
  message: string;
  icon?: React.ReactNode;
}

export default function NotFound({ message, icon }: NotFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
      <div className="mb-4">
        {icon || <FireIcon className="h-12 w-12 text-gray-400" />}
      </div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        No Content Selected
      </h2>
      <p className="text-gray-600">{message}</p>
    </div>
  );
}
