"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, LogOut, Search } from "lucide-react";
import { Trash2, Heart, Download, Flag } from "lucide-react";
interface NavbarProps {
  show?: boolean;
}

const Navbar = ({ show = false }: NavbarProps) => {
  const pathname = usePathname();
  const [showSearch, setShowSearch] = useState(false);

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
          <div className="flex items-center gap-6">
            <Link href="/create" className="font-semibold cursor-pointer">
              Create
            </Link>
            {/* <Link href="/explore" className="hover:text-gray-400 cursor-pointer">
              Explore
            </Link> */}
            <Link
              href="/account"
              className="hover:text-gray-400 cursor-pointer"
            >
              Account
            </Link>
            <Link href="/about" className="hover:text-gray-400 cursor-pointer">
              About
            </Link>
          </div>
        </div>
        {
            show && (
        <div className="flex gap-6 justify-end mb-4">
          <Trash2 className="w-5 h-5 cursor-pointer" />
          <Flag className="w-5 h-5 cursor-pointer" />
          <Heart className="w-5 h-5 cursor-pointer" />
          <Download className="w-5 h-5 cursor-pointer" />
        </div>
                
            )
        }
        {/* Right Side - Buttons */}
        <div className="flex items-center gap-4">
          {isAccountPage ? (
            <button className="text-sm text-gray-400 hover:text-white flex items-center gap-2">
              <LogOut className="w-5 h-5" /> Logout
            </button>
          ) : (
            <>
              <div className="flex items-center gap-2 border-none px-3 py-1 rounded-md hover:bg-gray-600 cursor-pointer">
                View <LayoutGrid className="w-4 h-4" />
              </div>
              <button
                className="hover:text-gray-400"
                onClick={toggleSearch}
                aria-label="Toggle Search"
              >
                <Search className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>

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
