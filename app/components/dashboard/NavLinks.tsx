"use client";

import {
  UserIcon,
  HomeIcon,
  UsersIcon,
  NewspaperIcon,
  VideoCameraIcon,
  PhotoIcon,
  FolderIcon,
  AcademicCapIcon,
  BanknotesIcon,
  TagIcon,
  CloudIcon,
  FolderOpenIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import NavLink from "./NavLink";

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: "Home", href: "/dashboard", icon: HomeIcon },
  {
    name: "Users",
    href: "/dashboard/users",
    icon: UsersIcon,
  },
  { name: "Authors", href: "/dashboard/author", icon: UserIcon },
  { name: "Articles", href: "/dashboard/articles", icon: NewspaperIcon },
  { name: "Videos", href: "/dashboard/videos", icon: VideoCameraIcon },
  { name: "Photos", href: "/dashboard/photos", icon: PhotoIcon },
  { name: "Categories", href: "/dashboard/categories", icon: FolderIcon },
  {
    name: "Subcategories",
    href: "/dashboard/subcategories",
    icon: FolderOpenIcon,
  },
  { name: "Sponsors", href: "/dashboard/sponsor", icon: AcademicCapIcon },
  {
    name: "Advertisements",
    href: "/dashboard/advertisements",
    icon: BanknotesIcon,
  },
  {
    name: "Tags",
    href: "/dashboard/tags",
    icon: TagIcon,
  },
  {
    name: "Test Upload",
    href: "/dashboard/test-upload",
    icon: CloudIcon,
  },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <div className="grid w-full grid-cols-6 gap-1.5 md:flex md:flex-col md:gap-0">
      {links.map((link) => {
        const LinkIcon = link.icon;
        const isActive = pathname === link.href;

        return (
          <div key={link.name}>
            <div className="flex items-center justify-between rounded-md p-2 text-sm font-medium">
              <NavLink href={link.href} icon={LinkIcon} label={link.name} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
