"use client";

import Logo from "./Logo";

export default function BrandName() {
  return (
    <div className="flex flex-col items-center md:items-start">
      <Logo />
      <p className="mt-4 text-sm text-gray-500 text-center md:text-left">
        Your trusted source for diverse news, insights, and stories across
        multiple categories.
      </p>
    </div>
  );
}
