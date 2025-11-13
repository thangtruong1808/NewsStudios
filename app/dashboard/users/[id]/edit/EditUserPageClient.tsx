"use client";

import { useParams } from "next/navigation";
import UserForm from "../../../../components/dashboard/users/form/UserForm";
import { getUserById } from "../../../../lib/actions/users";
import { useEffect, useState } from "react";
import FormSkeleton from "../../../../components/dashboard/shared/skeleton/FormSkeleton";

// Description: Load and render user edit form with data fetching and skeleton states.
// Data created: 2024-11-13
// Author: thangtruong
export default function EditUserPageClient() {
  const params = useParams();
  const userId = params.id as string;
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await getUserById(parseInt(userId));
        if (error) {
          setError(error);
          return;
        }
        if (data) {
          setUser(data);
        } else {
          setError("User not found");
        }
      } catch (err) {
        setError("Failed to fetch user data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="w-full">
        <FormSkeleton
          fields={7} // Number of fields in the user form: image, firstname, lastname, email, password, role, status, description
          showHeader={true}
          showActions={true}
        />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-gray-50">
      <UserForm user={user} isEditMode={true} />
    </div>
  );
} 