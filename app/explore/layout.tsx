"use client";

import NavBar from "../components/front-end/NavBar";
import Footer from "../components/front-end/Footer";

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full bg-white min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1">
        <div className="max-w-[1536px] mx-auto px-4">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
