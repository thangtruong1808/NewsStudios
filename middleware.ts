import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: [
    // Match all paths except:
    // - api routes
    // - static files
    // - next.js image optimization
    // - Images directory
    // - login page
    // - home page
    "/((?!api|_next/static|_next/image|Images/|login|$).*)",
  ],
};
