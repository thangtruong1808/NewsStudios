import { DefaultSession } from "next-auth";

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
