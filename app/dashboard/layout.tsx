import SideNav from "../components/dashboard/SideNav";
import { Toaster } from "react-hot-toast";
import { auth } from "../../auth";
import { redirect } from "next/navigation";

// Remove experimental_ppr flag as it might be causing issues
// export const experimental_ppr = true;

// Use revalidate instead of force-dynamic for better performance
// export const revalidate = 0;
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    // Check for authentication using NextAuth.js
    const session = await auth();

    if (!session) {
      // Use absolute URL to prevent redirect loops
      redirect(
        new URL(
          "/login",
          process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000"
        ).toString()
      );
    }

    return (
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-64">
          <SideNav />
        </div>
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
          {children}
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#363636",
              color: "#fff",
            },
          }}
        />
      </div>
    );
  } catch (error) {
    console.error("Authentication error:", error);
    // Use absolute URL to prevent redirect loops
    redirect(
      new URL(
        "/login",
        process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000"
      ).toString()
    );
  }
}
