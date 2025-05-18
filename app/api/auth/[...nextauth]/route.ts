import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getUserByEmail } from "../../../lib/actions/users";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await getUserByEmail(credentials.email);

        if (!user) return null;

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isPasswordValid) return null;

        return {
          id: user.id.toString(),
          email: user.email,
          name: `${user.firstname} ${user.lastname}`,
          image: user.user_image || "",
          role: user.role,
          firstname: user.firstname,
          lastname: user.lastname,
          status: user.status,
          created_at: user.created_at,
          updated_at: user.updated_at,
        } as any;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session) {
        // When session is updated, merge the new session data with the token
        return {
          ...token,
          ...session.user,
          role: session.user.role,
          firstname: session.user.firstname,
          lastname: session.user.lastname,
          user_image: session.user.user_image,
          status: session.user.status,
        };
      }

      if (user) {
        // Initial sign in
        token.id = user.id;
        token.firstname = user.firstname;
        token.lastname = user.lastname;
        token.role = user.role;
        token.image = user.image;
        token.status = user.status;
        token.created_at = user.created_at;
        token.updated_at = user.updated_at;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // Always use the latest token data for the session
        session.user.id = token.id;
        session.user.firstname = token.firstname;
        session.user.lastname = token.lastname;
        session.user.role = token.role;
        session.user.user_image = token.image as string | undefined;
        session.user.status = token.status;
        session.user.created_at = token.created_at;
        session.user.updated_at = token.updated_at;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
