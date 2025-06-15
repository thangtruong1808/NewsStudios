"use client";

import NavBar from "../components/front-end/navbar/NavBar";
import Footer from "../components/front-end/Footer";
import TopButton from "../components/front-end/shared/TopButton";

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
