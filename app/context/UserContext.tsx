"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { User } from "../lib/definition";
import { useSession } from "next-auth/react";

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUser: (updatedData: Partial<User>) => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Only store non-sensitive data
const sanitizeUserData = (user: User | null) => {
  if (!user) return null;
  return {
    id: user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    role: user.role,
    user_image: user.user_image,
    email: user.email,
    status: user.status,
    description: user.description,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
};

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status, update: updateSession } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Debug logs
  console.log("Session Status:", status);
  console.log("Session Data:", session);
  console.log("Current User State:", user);

  // Initialize user data from session
  useEffect(() => {
    console.log("Effect triggered - Session Status:", status);
    console.log("Effect triggered - Session Data:", session);

    if (status === "loading") {
      setIsLoading(true);
      return;
    }

    if (status === "authenticated" && session?.user) {
      console.log("Converting session user to User type");
      // Convert session user to our User type
      const sessionUser: User = {
        id: Number(session.user.id),
        firstname: session.user.firstname,
        lastname: session.user.lastname,
        email: session.user.email,
        password: "", // Not available in session
        role: session.user.role,
        status: session.user.status,
        description: session.user.description || "",
        user_image: session.user.user_image || "",
        created_at: session.user.created_at,
        updated_at: session.user.updated_at,
      };

      console.log("Converted User:", sessionUser);
      setUser(sessionUser);
      setIsLoading(false);
    } else if (status === "unauthenticated") {
      console.log("No authenticated session found");
      setUser(null);
      setIsLoading(false);
    }
  }, [session, status]);

  // Function to update specific user fields
  const updateUser = useCallback(
    async (updatedData: Partial<User>) => {
      console.log("Updating user with data:", updatedData);
      if (!user) {
        console.log("No user to update");
        return;
      }

      const newUser = {
        ...user,
        ...updatedData,
        updated_at: new Date().toISOString(),
      };

      console.log("New user data:", newUser);

      // First update the session
      await updateSession({
        ...session,
        user: {
          ...session?.user,
          ...updatedData,
        },
      });

      // Then update the local state
      setUser(newUser);
      console.log("User updated successfully");
    },
    [user, session, updateSession]
  );

  const value = {
    user,
    setUser,
    updateUser,
    isLoading: isLoading || status === "loading",
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
