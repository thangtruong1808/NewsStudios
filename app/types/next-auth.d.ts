import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    role: string;
    user_image: string | null;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      firstname: string;
      lastname: string;
      role: string;
      user_image: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    role: string;
    user_image: string | null;
  }
}
