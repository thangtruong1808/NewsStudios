"use client";

import NavBar from "../navbar/NavBar";
import Footer from "../Footer";
import TopButton from "../shared/TopButton";

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <TopButton />
    </div>
  );
} 