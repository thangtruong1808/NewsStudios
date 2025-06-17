import type { _User } from "next-auth";
import type { _Session } from "next-auth";
import type { _JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
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

  interface Session extends DefaultSession {
    user: {
      id: string;
      firstname: string;
      lastname: string;
      email: string;
      role: "admin" | "user" | "editor";
      status: "active" | "inactive";
      description?: string;
      user_image?: string;
      created_at: string;
      updated_at: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
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
}
