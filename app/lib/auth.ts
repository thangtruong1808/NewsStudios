// Component Info
// Description: Server-side authentication utilities using NextAuth.
// Date created: 2025-01-27
// Author: thangtruong

import { getServerSession } from "next-auth";
import { authOptions } from "./auth-config";

export const getAuthSession = () => getServerSession(authOptions);
