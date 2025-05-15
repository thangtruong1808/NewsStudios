"use client";

import AuthorForm from "@/app/components/dashboard/authors/form/AuthorForm";

export default function CreateAuthorPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-2">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4">
          <AuthorForm />
        </div>
      </div>
    </div>
  );
}
