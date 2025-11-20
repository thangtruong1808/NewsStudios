// Component Info
// Description: Server-side authentication utilities using NextAuth.
// Date updated: 2025-November-21
// Author: thangtruong

import { getServerSession } from "next-auth";
import { authOptions } from "./auth-config";

export const getAuthSession = () => getServerSession(authOptions);
