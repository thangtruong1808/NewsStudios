"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: "admin" | "user" | "editor";
  status: "active" | "inactive";
  description?: string;
  user_image?: string;
  created_at: string;
  updated_at: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
