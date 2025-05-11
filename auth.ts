import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { query } from "./app/lib/db/db";

interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role?: string;
}

async function getUser(email: string): Promise<User | undefined> {
  try {
    const result = await query("SELECT * FROM Users WHERE email = ?", [email]);

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

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;
        const user = await getUser(email);
        if (!user) return null;

        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
});
