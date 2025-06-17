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
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter your email and password");
        }

        const user = await getUserByEmail(credentials.email);

        if (!user) {
          throw new Error("Invalid email or password. Please try again.");
        }

        if (user.status === "inactive") {
          throw new Error(
            "Your account is inactive. Please contact the administrator."
          );
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isPasswordValid) {
          throw new Error("Invalid email or password. Please try again.");
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: `${user.firstname} ${user.lastname}`,
          user_image: user.user_image || "",
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
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.user_image = user.user_image;
        token.role = user.role;
        token.firstname = user.firstname;
        token.lastname = user.lastname;
        token.status = user.status;
        token.created_at = user.created_at;
        token.updated_at = user.updated_at;
      }
      return token;
    },
    async session({ session, token }) {
      try {
        if (token) {
          session.user = {
            ...session.user,
            id: token.id,
            email: token.email,
            name: token.name,
            user_image: token.user_image,
            role: token.role,
            firstname: token.firstname,
            lastname: token.lastname,
            status: token.status,
            created_at: token.created_at,
            updated_at: token.updated_at,
          };
        }
        return session;
      } catch (error) {
        console.error('Session callback error:', error);
        return session;
      }
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
