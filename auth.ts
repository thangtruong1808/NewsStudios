import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "./app/lib/actions/users";

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      async authorize(credentials) {
        console.log("Authorizing credentials:", credentials);
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          console.log("Invalid credentials format");
          return null;
        }

        const { email, password } = parsedCredentials.data;
        const user = await getUserByEmail(email);

        console.log("Found user:", user);

        if (!user) {
          console.log("No user found with email:", email);
          return null;
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);
        console.log("Password match:", passwordsMatch);

        if (!passwordsMatch) {
          console.log("Password does not match");
          return null;
        }

        const sessionUser = {
          id: user.id.toString(),
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          role: user.role,
          status: user.status,
          description: user.description,
          user_image: user.user_image,
          created_at: user.created_at,
          updated_at: user.updated_at,
        };

        console.log("Returning session user:", sessionUser);
        return sessionUser;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      console.log("JWT Callback - Token:", token);
      console.log("JWT Callback - User:", user);
      console.log("JWT Callback - Trigger:", trigger);
      console.log("JWT Callback - Session:", session);

      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.firstname = user.firstname;
        token.lastname = user.lastname;
        token.role = user.role;
        token.status = user.status;
        token.description = user.description;
        token.user_image = user.user_image;
        token.created_at = user.created_at;
        token.updated_at = user.updated_at;
      }

      // Handle session updates
      if (trigger === "update" && session) {
        token = { ...token, ...session.user };
      }

      console.log("JWT Callback - Updated Token:", token);
      return token;
    },
    async session({ session, token }) {
      console.log("Session Callback - Session:", session);
      console.log("Session Callback - Token:", token);

      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.firstname = token.firstname as string;
        session.user.lastname = token.lastname as string;
        session.user.role = token.role as "admin" | "user" | "editor";
        session.user.status = token.status as "active" | "inactive";
        session.user.description = token.description as string | undefined;
        session.user.user_image = token.user_image as string | undefined;
        session.user.created_at = token.created_at as string;
        session.user.updated_at = token.updated_at as string;
      }

      console.log("Session Callback - Updated Session:", session);
      return session;
    },
  },
});
