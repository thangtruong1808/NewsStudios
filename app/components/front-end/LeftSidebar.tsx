"use client";

export default function LeftSidebar() {
  return (
    <div className="hidden lg:block w-64 bg-gradient-to-b from-indigo-900 to-indigo-800 p-4 text-white rounded-lg">
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Quick Links</h2>
        <nav className="space-y-2">
          <a
            href="#"
            className="block px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
          >
            Home
          </a>
          <a
            href="#"
            className="block px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
          >
            About
          </a>
          <a
            href="#"
            className="block px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
          >
            Services
          </a>
          <a
            href="#"
            className="block px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
          >
            Contact
          </a>
        </nav>

        <div className="pt-4 border-t border-indigo-700">
          <h3 className="text-lg font-semibold mb-3">Categories</h3>
          <div className="space-y-2">
            <a
              href="#"
              className="block px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
            >
              Technology
            </a>
            <a
              href="#"
              className="block px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
            >
              Business
            </a>
            <a
              href="#"
              className="block px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
            >
              Lifestyle
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
