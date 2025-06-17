"use client";

import NavBar from "../components/front-end/navbar/NavBar";
import Footer from "../components/front-end/Footer";
import TopButton from "../components/front-end/shared/TopButton";

interface ExploreLayoutClientProps {
  children: React.ReactNode;
}

export default function ExploreLayoutClient({ children }: ExploreLayoutClientProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <TopButton />
    </div>
  );
} 