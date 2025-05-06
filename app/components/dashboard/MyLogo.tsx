import { NewspaperIcon } from "@heroicons/react/24/outline";
import { lusitana } from "../fonts";
import Link from "next/link";

export default function MyLogo() {
  return (
    <Link
      href="/"
      className={`${lusitana.className} flex h-full w-full items-center justify-center leading-none text-white hover:opacity-80 transition-opacity`}
    >
      <div className="flex flex-col items-center justify-center">
        <NewspaperIcon className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 text-white mb-2" />
        <p className="text-[18px] sm:text-[20px] md:text-[22px] text-white">
          DailyTechNews
        </p>
      </div>
    </Link>
  );
}
