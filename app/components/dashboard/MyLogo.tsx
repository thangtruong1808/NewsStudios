import Link from "next/link";
import Image from "next/image";

/**
 * MyLogo Component
 * Displays the application logo with a newspaper icon and brand name
 * Features hover effects and gradient styling
 */
export default function MyLogo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image
        src="/logo.png"
        alt="NewsStudios Logo"
        width={40}
        height={40}
        className="rounded-full"
      />
      <span className="text-xl font-bold">NewsStudios</span>
    </Link>
  );
}
