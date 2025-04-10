import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { lusitana } from "../fonts";
import Link from "next/link";

export default function MyLogo() {
  return (
    <Link
      href="/"
      className={`${lusitana.className} flex w-full flex-row items-center justify-center leading-none text-white hover:opacity-80 transition-opacity`}
    >
      <div className="flex items-center justify-center gap-2">
        <GlobeAltIcon className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rotate-[90deg] text-white" />
        <p className="text-[20px] sm:text-[24px] md:text-[28px] text-white">
          NewsHub
        </p>
      </div>
    </Link>
  );
}
