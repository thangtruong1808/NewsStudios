"use client";

interface UsersEmptyProps {
  searchQuery: string;
}

export default function UsersEmpty({ searchQuery }: UsersEmptyProps) {
  return (
    <div className="mt-6 rounded-md bg-gray-50 p-6 text-center">
      <p className="text-red-500">
        {searchQuery
          ? "No users found matching your search criteria."
          : "No users found. Create your first user to get started."}
      </p>
    </div>
  );
}
