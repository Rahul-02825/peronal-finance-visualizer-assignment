// components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 w-full bg-neutral-900 text-white py-4 px-6 shadow-md z-50">
      <div className="flex justify-between items-center">
        <div className="text-xl font-semibold">
          {pathname === "/transactions" ? "Transactions" : "Dashboard"}
        </div>
        <div className="space-x-4">
          <Link
            href="/"
            className={clsx("hover:underline", {
              "text-blue-400": pathname === "/",
            })}
          >
            Dashboard
          </Link>
          <Link
            href="/transactions"
            className={clsx("hover:underline", {
              "text-blue-400": pathname === "/transactions",
            })}
          >
            Transactions
          </Link>
        </div>
      </div>
    </nav>
  );
}
