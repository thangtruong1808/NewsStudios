import Image from "next/image";
import Button from "./components/Button";

export default function Home() {
  return (
    <div>
      <h1>Hello</h1>
      <Button href="/dashboard/">Go to dashboard</Button>
    </div>
  );
}
