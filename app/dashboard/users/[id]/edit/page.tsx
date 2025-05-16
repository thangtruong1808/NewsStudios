"use client";

import { notFound, useParams } from "next/navigation";
import UserForm from "../../../../components/dashboard/users/form/UserForm";
import { getUserById } from "../../../../lib/actions/users";
import { useEffect, useState } from "react";
import FormSkeleton from "../../../../components/dashboard/shared/skeleton/FormSkeleton";

export default function EditUserPage() {
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
      <div className="mx-auto max-w-4xl px-4 py-2">
        <div className="bg-white rounded-lg shadow">
          <div className="p-4">
            <FormSkeleton
              fields={7} // Number of fields in the user form: image, firstname, lastname, email, password, role, status, description
              showHeader={true}
              showActions={true}
            />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-2">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4">
          <UserForm user={user} isEditMode={true} />
        </div>
      </div>
    </div>
  );
}
