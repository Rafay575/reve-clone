"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, LogOut, Search, Trash2, Heart, Download, Flag, Menu } from "lucide-react";

interface NavbarProps {
  show?: boolean;
}

const Navbar = ({ show = false }: NavbarProps) => {
  const pathname = usePathname();
  const [showSearch, setShowSearch] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleSearch = () => {
    setShowSearch((prev) => !prev);
  };

  const isAccountPage = pathname === "/account";

  return (
    <nav className="flex flex-col bg-black text-white px-6 py-4">
      {/* Top Nav */}
      <div className="flex justify-between items-center">
        {/* Left Side - Logo & Menu */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-bold">
            <span className="text-purple-400">Reve</span>
          </Link>
          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/create" className="font-semibold cursor-pointer">
              Create
            </Link>
            <Link href="/account" className="hover:text-gray-400 cursor-pointer">
              Account
            </Link>
            <Link href="/about" className="hover:text-gray-400 cursor-pointer">
              About
            </Link>
          </div>
        </div>

        {/* Icons Section */}
        <div className="flex items-center gap-4">
          {show && (
            <div className="hidden md:flex gap-4">
              <Trash2 className="w-5 h-5 cursor-pointer" />
              <Flag className="w-5 h-5 cursor-pointer" />
              <Heart className="w-5 h-5 cursor-pointer" />
              <Download className="w-5 h-5 cursor-pointer" />
            </div>
          )}

          {isAccountPage ? (
            <button className="text-sm text-gray-400 hover:text-white flex items-center gap-2">
              <LogOut className="w-5 h-5" /> Logout
            </button>
          ) : (
            <>
              <div className="hidden md:flex items-center gap-2 border-none px-3 py-1 rounded-md hover:bg-gray-600 cursor-pointer">
                View <LayoutGrid className="w-4 h-4" />
              </div>
              <button
                className="hidden md:block hover:text-gray-400"
                onClick={toggleSearch}
                aria-label="Toggle Search"
              >
                <Search className="w-5 h-5" />
              </button>
              {/* Hamburger Button */}
              <button
                className="md:hidden"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-label="Toggle Menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu Links */}
      {menuOpen && (
        <div className="flex flex-col mt-4 gap-2 md:hidden">
          <Link href="/create" className="font-semibold cursor-pointer">
            Create
          </Link>
          <Link href="/account" className="hover:text-gray-400 cursor-pointer">
            Account
          </Link>
          <Link href="/about" className="hover:text-gray-400 cursor-pointer">
            About
          </Link>

          {/* Mobile Icons if show selected */}
          {show && (
            <div className="flex gap-4 mt-2">
              <Trash2 className="w-5 h-5 cursor-pointer" />
              <Flag className="w-5 h-5 cursor-pointer" />
              <Heart className="w-5 h-5 cursor-pointer" />
              <Download className="w-5 h-5 cursor-pointer" />
            </div>
          )}
        </div>
      )}

      {/* Search Bar (only outside /account) */}
      {!isAccountPage && (
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            showSearch ? "max-h-40 mt-4" : "max-h-0"
          }`}
        >
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-gray-600 border border-gray-500 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
