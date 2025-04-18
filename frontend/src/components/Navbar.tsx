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
    <nav className="fixed top-0 left-0 w-full bg-neutral-900 text-white py-4 px-6 shadow-md z-50">
      <div className="flex justify-between items-center">
        <div className="text-xl font-semibold">
          {pathname === "/transactions"
            ? "Transactions"
            : pathname === "/budgets"
            ? "Budgets"
            : "Dashboard"}
        </div>

        <div className="hidden md:flex space-x-4">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={clsx("hover:underline", {
                "text-blue-400": isActive(href),
              })}
            >
              {label}
            </Link>
          ))}
        </div>

        <button
          className="md:hidden focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col space-y-2">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={clsx("block hover:underline px-2", {
                "text-blue-400": isActive(href),
              })}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
