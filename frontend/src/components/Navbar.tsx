"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const isActive = (path: string) => pathname === path;

  const links = [
    { href: "/", label: "Dashboard" },
    { href: "/transactions", label: "Transactions" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-neutral-900 to-neutral-800 text-white py-4 px-6 shadow-md z-50">
      <div className="flex justify-between items-center">
        <div className="text-xl font-bold">
          <span className="text-blue-400">Finance  </span>
          <span>visualizer</span>
        </div>

        <div className="hidden md:flex space-x-6">
          {links.map(({ href, label }, index) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                "relative px-2 py-1 transition-all duration-300",
                {
                  "text-blue-400 font-medium": isActive(href),
                  "hover:text-blue-300": !isActive(href),
                }
              )}
            >
              {label}
              {isActive(href) && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400 transform origin-bottom"></span>
              )}
            </Link>
          ))}
        </div>

        <button
          className="md:hidden focus:outline-none p-2 rounded-md hover:bg-neutral-700 transition-colors duration-200"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu with Animation */}
      <div 
        className={clsx(
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
          {
            "max-h-40 opacity-100 mt-4": menuOpen,
            "max-h-0 opacity-0": !menuOpen
          }
        )}
      >
        <div className="flex flex-col bg-neutral-800 rounded-lg shadow-lg">
          {links.map(({ href, label }, index) => (
            <>
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={clsx(
                  "block py-3 px-4 transition-all duration-200",
                  {
                    "bg-neutral-700 text-blue-400 font-medium": isActive(href),
                    "hover:bg-neutral-700": !isActive(href),
                  }
                )}
              >
                {label}
              </Link>
              {index < links.length - 1 && (
                <div className="border-b border-neutral-600 mx-3"></div>
              )}
            </>
          ))}
        </div>
      </div>
    </nav>
  );
}