import MyLogo from "./MyLogo";
import NavLinks from "./NavLinks";
import SignOutButton from "./SignOutButton";

export default function SideNav() {
  return (
    <div className="flex h-full flex-col bg-indigo-200">
      <div className="w-full bg-indigo-600">
        <div className="h-20 md:h-40">
          <MyLogo />
        </div>
      </div>
      <div className="flex flex-col space-y-2 px-2 py-2 md:px-2 md:h-full">
        <div className="flex flex-col space-y-2 md:grow">
          <NavLinks />
        </div>
        <div className="flex h-12 items-center md:hidden">
          <SignOutButton isMobile={true} />
        </div>
        <div className="hidden w-full md:block">
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
