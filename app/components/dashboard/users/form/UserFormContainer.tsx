"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { User } from "../../../../login/login-definitions";
import {
  createUser,
  updateUser,
  getUserById,
} from "../../../../lib/actions/users";
import { userSchema, UserFormValues } from "./userSchema";
import UserForm from "./UserForm";
import UserFormLoading from "./UserFormLoading";
import UserFormError from "./UserFormError";
import { useSession } from "next-auth/react";

interface UserFormContainerProps {
  userId?: string;
}

export default function UserFormContainer({ userId }: UserFormContainerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(!!userId);
  const [userData, setUserData] = useState<User | undefined>(undefined);
  const isEditMode = !!userId && searchParams.get("edit") === "true";
  const { data: session } = useSession();

  console.log("UserFormContainer - userId:", userId);
  console.log("UserFormContainer - isEditMode:", isEditMode);
  console.log("UserFormContainer - searchParams:", searchParams.get("edit"));

  // Fetch user data if userId is provided
  useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        try {
          setIsLoading(true);
          const { data: user, error } = await getUserById(parseInt(userId));

          if (error) {
            setError(error);
            return;
          }

          if (user) {
            const userData: User = {
              id: user.id,
              firstname: user.firstname,
              lastname: user.lastname,
              email: user.email,
              password: user.password,
              role: user.role,
              status: user.status,
              description: user.description || "",
              user_image: user.user_image || "",
              created_at: user.created_at,
              updated_at: user.updated_at,
            };

            setUserData(userData);
          } else {
            setError("User not found");
          }
        } catch (err) {
          setError("Failed to fetch user data");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUser();
  }, [userId]);

  useEffect(() => {
    if (session?.user) {
      // Convert session user to our User type with all required fields
      const sessionUser: User = {
        id: Number(session.user.id) || 0,
        firstname: (session.user as any).firstname || "",
        lastname: (session.user as any).lastname || "",
        email: session.user.email || "",
        password: "", // Not available in session
        role: (session.user as any).role || "user",
        status: (session.user as any).status || "active",
        description: (session.user as any).description || "",
        user_image: (session.user as any).user_image || "",
        created_at:
          (session.user as any).created_at || new Date().toISOString(),
        updated_at:
          (session.user as any).updated_at || new Date().toISOString(),
      };
      setUserData(sessionUser);
    } else {
      setUserData(undefined);
    }
  }, [session]);

  if (isLoading) {
    return <UserFormLoading />;
  }

  if (error) {
    return <UserFormError error={error} />;
  }

  return <UserForm user={userData} isEditMode={isEditMode} />;
}
