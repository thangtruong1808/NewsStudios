import {
  Inter,
  Roboto_Mono,
  Lusitana,
  Poppins,
  Open_Sans,
} from "next/font/google";

// Inter font for general text and headings
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  // Include different weights for flexibility
  weight: ["400", "500", "600", "700"],
});

// Roboto Mono for table data and numbers
export const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-mono",
  // Include different weights for flexibility
  weight: ["400", "500", "600"],
});

// Lusitana font for existing functionality
export const lusitana = Lusitana({
  weight: ["400", "700"],
  subsets: ["latin"],
});

// Poppins for headings and titles - modern, clean, and highly readable
export const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
});

// Open Sans for body text - excellent readability and user-friendly
export const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
  weight: ["400", "500", "600", "700"],
});

// Font class names for use in components
export const fontClasses = {
  // For general text and headings
  inter: inter.className,
  // For table data and numbers
  robotoMono: robotoMono.className,
  // For existing Lusitana usage
  lusitana: lusitana.className,
  // For headings and titles
  poppins: poppins.className,
  // For body text
  openSans: openSans.className,
  // Combined classes for components that need both
  combined: `${inter.variable} ${robotoMono.variable} ${poppins.variable} ${openSans.variable}`,
};
