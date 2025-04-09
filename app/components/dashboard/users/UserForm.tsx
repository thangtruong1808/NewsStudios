"use client";

import { UserForm as RefactoredUserForm } from "./form";

interface UserFormProps {
  userId?: string;
}

export default function UserForm({ userId }: UserFormProps) {
  return <RefactoredUserForm userId={userId} />;
}
