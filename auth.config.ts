import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
    signOut: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");

      // Allow direct access to images from the hosting server
      if (
        nextUrl.pathname.startsWith("/Images/") ||
        nextUrl.hostname === "srv876-files.hstgr.io"
      ) {
        return true;
      }

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }

      return true; // Allow access to all other pages
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
