import Button from "./components/Button";
import NavBar from "./components/front-end/NavBar";
import Footer from "./components/front-end/Footer";
import Advertisements from "./components/front-end/Advertisements";
import Sponsors from "./components/front-end/Sponsors";
import LeftSidebar from "./components/front-end/LeftSidebar";
import RightSidebar from "./components/front-end/RightSidebar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="flex">
        <LeftSidebar />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-4">Welcome to My Portfolio</h1>
          <div className="flex space-x-4">
            <Button href="/photos">View Photo Gallery</Button>
          </div>
          <div className="w-full mt-12">
            <Advertisements />
          </div>
          <div className="w-full mt-12">
            <Sponsors />
          </div>
        </main>
        <RightSidebar />
      </div>
      <Footer />
    </div>
  );
}
