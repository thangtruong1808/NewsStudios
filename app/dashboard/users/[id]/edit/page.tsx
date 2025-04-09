"use client";

import { notFound, useParams } from "next/navigation";
import UserForm from "../../../../components/dashboard/users/UserForm";

export default function EditUserPage() {
  // Get the ID parameter from the URL
  const params = useParams();
  const userId = params.id;
  console.log("EditUserPage - User ID from params:", userId);

  // Validate and parse the ID parameter
  const id = Number(userId);
  if (isNaN(id) || id <= 0) {
    console.error("Invalid user ID:", userId);
    notFound();
  }

  return (
    <div className="space-y-4">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">Edit User</h1>
      </div>
      <UserForm userId={id.toString()} />
    </div>
  );
}
