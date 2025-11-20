// Component Info
// Description: NextAuth route handler for authentication endpoints.
// Date updated: 2025-November-21
// Author: thangtruong

import NextAuth from "next-auth";
import { authOptions } from "@/app/lib/auth-config";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
