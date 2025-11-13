import Logo from "./Logo";

// Component Info
// Description: Static brand label pairing the logo with supporting copy.
// Data created: Branding copy for footer and hero usage.
// Author: thangtruong

export default function BrandName() {
  return (
    <div className="flex flex-col items-center md:items-start">
      <Logo />
      <p className="mt-4 text-center text-sm text-gray-500 md:text-left">
        Your trusted source for diverse news, insights, and stories across multiple categories.
      </p>
    </div>
  );
}
