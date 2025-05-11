import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { query } from "./app/lib/db/db";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

interface User {
  id: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  role: string;
  user_image: string | null;
}

interface CustomJWT extends JWT {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  role: string;
  user_image: string | null;
}

interface CustomSession extends Session {
  user: {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    role: string;
    user_image: string | null;
  };
}

async function getUser(email: string): Promise<User | undefined> {
  try {
    const result = await query("SELECT * FROM Users WHERE email = ?", [email]);
    console.log("Database query result:", result);

    if (
      result.error ||
      !result.data ||
      !Array.isArray(result.data) ||
      result.data.length === 0
    ) {
      return undefined;
    }

    return result.data[0] as User;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export const authOptions: NextAuthConfig = {
  ...authConfig,
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    authorized: authConfig.callbacks.authorized,
    async jwt({ token, user, account }): Promise<CustomJWT> {
      console.log("JWT Callback - User:", user);
      console.log("JWT Callback - Token before:", token);
      console.log("JWT Callback - Account:", account);

      if (user) {
        // Create new token with our custom structure
        const newToken: CustomJWT = {
          ...token,
          id: user.id as string,
          email: user.email || "",
          firstname: user.firstname || "",
          lastname: user.lastname || "",
          role: user.role || "user",
          user_image: user.user_image,
          sub: user.id, // Keep sub for NextAuth compatibility
        };
        console.log("JWT Callback - New Token:", newToken);
        return newToken;
      }

      // If no user, return existing token
      console.log("JWT Callback - Token after:", token);
      return token as CustomJWT;
    },
    async session({ session, token }): Promise<CustomSession> {
      console.log("Session Callback - Token:", token);
      console.log("Session Callback - Session before:", session);

      if (token) {
        // Create new session user with our custom structure
        const newSession: CustomSession = {
          ...session,
          user: {
            id: token.id as string,
            email: token.email as string,
            firstname: token.firstname as string,
            lastname: token.lastname as string,
            role: token.role as string,
            user_image: token.user_image,
          },
        };
        console.log("Session Callback - New Session:", newSession);
        return newSession;
      }

      console.log("Session Callback - Session after:", session);
      return session as CustomSession;
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;
        const user = await getUser(email);
        console.log("Authorize - Found user:", user);

        if (!user) return null;

        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) return null;

        const returnUser = {
          id: user.id,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          role: user.role,
          user_image: user.user_image,
        };
        console.log("Authorize - Returning user:", returnUser);
        return returnUser;
      },
    }),
  ],
};

export const { auth, signIn, signOut } = NextAuth(authOptions);
