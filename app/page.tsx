import Button from "./components/Button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to My Portfolio</h1>
      <div className="flex space-x-4">
        <Button href="/photos">View Photo Gallery</Button>
        <Button href="/login">Login</Button>
      </div>
    </div>
  );
}
