import Button from "./components/Button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Button href="/login">Login</Button>
    </div>
  );
}
