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

interface NavLinksProps {
  isCollapsed?: boolean;
}

// Group links by category for better organization
const linkGroups = [
  {
    name: "Main",
    links: [
      { name: "Home", href: "/dashboard", icon: HomeIcon },
      { name: "Articles", href: "/dashboard/articles", icon: NewspaperIcon },
      { name: "Videos", href: "/dashboard/videos", icon: VideoCameraIcon },
      { name: "Photos", href: "/dashboard/photos", icon: PhotoIcon },
    ],
  },
  {
    name: "Users & Authors",
    links: [
      { name: "Users", href: "/dashboard/users", icon: UsersIcon },
      { name: "Authors", href: "/dashboard/author", icon: UserIcon },
    ],
  },
  {
    name: "Content Management",
    links: [
      { name: "Categories", href: "/dashboard/categories", icon: FolderIcon },
      {
        name: "Subcategories",
        href: "/dashboard/subcategories",
        icon: FolderOpenIcon,
      },
      { name: "Tags", href: "/dashboard/tags", icon: TagIcon },
    ],
  },
  {
    name: "Business",
    links: [
      { name: "Sponsors", href: "/dashboard/sponsor", icon: AcademicCapIcon },
      {
        name: "Advertisements",
        href: "/dashboard/advertisements",
        icon: BanknotesIcon,
      },
    ],
  },
  {
    name: "Tools",
    links: [
      { name: "Test Upload", href: "/dashboard/test-upload", icon: CloudIcon },
    ],
  },
];

export default function NavLinks({ isCollapsed }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      {linkGroups.map((group) => (
        <div key={group.name}>
          {!isCollapsed && (
            <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {group.name}
            </h3>
          )}
          <div className={clsx("mt-2 space-y-1", isCollapsed && "mt-1")}>
            {group.links.map((link) => {
              const LinkIcon = link.icon;
              const isActive = pathname === link.href;

              return (
                <div
                  key={link.name}
                  className={clsx(
                    "rounded-lg transition-all duration-200",
                    isActive &&
                      "bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10"
                  )}
                >
                  <NavLink
                    href={link.href}
                    icon={LinkIcon}
                    label={link.name}
                    isActive={isActive}
                    isCollapsed={isCollapsed}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
