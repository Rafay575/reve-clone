"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  LogOut,
  Heart,
  HeartOff,
  Trash2,
  Download,
  Menu,
  X,
  Check
} from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useLogout } from "@/lib/useLogout";

type RunwareImage = {
  id: string;
  imageURL: string;
  createdAt: string;
  is_favorite?: boolean;
  is_deleted?: boolean;
};
interface NavbarProps {
  show?: boolean;
  selected?: string[];
  images?: RunwareImage[];
  onFavorite?: (fav: boolean) => void;
  onDelete?: () => void;
  onDownload?: () => void;
  showFavorites?: boolean;
  setShowFavorites?: (show: boolean) => void;
  gridCols?: number;
  setGridCols?: (cols: number) => void;
}

const NAV_ITEMS = [
  { label: "Create", href: "/create" },
  { label: "Account", href: "/account" },
  { label: "About", href: "/about" },
];

const containerVariants: Variants = {
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
  hide: {},
};
const itemVariants: Variants = {
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 400, damping: 30 },
  },
  hide: { opacity: 0, y: -8 },
};

export default function Navbar({
  show = false,
  selected,
  images,
  onFavorite,
  onDelete,
  onDownload,
  showFavorites,
  setShowFavorites,
  gridCols,
  setGridCols,
}: NavbarProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { logout, loading } = useLogout("/");

  // View dropdown logic
  const [viewDropdown, setViewDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Auto-close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        viewDropdown &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setViewDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [viewDropdown]);

  const isAccountPage = pathname === "/account";
  const active = useMemo(() => {
    const found =
      NAV_ITEMS.find((n) => n.href === pathname) ??
      NAV_ITEMS.find((n) => pathname.startsWith(n.href)) ??
      NAV_ITEMS[0];
    return found;
  }, [pathname]);
  const rest = useMemo(
    () => NAV_ITEMS.filter((n) => n.href !== active.href),
    [active.href]
  );

  // Favoriting logic for selected
  const allFav =
    selected &&
    images &&
    selected.length > 0 &&
    selected.every((id) => images.find((im) => im.id === id)?.is_favorite);
  const allNotFav =
    selected &&
    images &&
    selected.length > 0 &&
    selected.every((id) => !images.find((im) => im.id === id)?.is_favorite);

  return (
    <nav className="sticky top-0 z-50 bg-black text-white px-6 py-4 border-b border-white/5 backdrop-blur">
      <div className="flex items-center justify-between">
        {/* Left: Logo + Desktop Nav */}
        <div
          className="hidden md:flex items-center gap-6"
          onMouseEnter={() => setExpanded(true)}
          onMouseLeave={() => setExpanded(false)}
        >
          <Link href="/" className="text-2xl font-bold leading-none rounded-sm">
            <span className="logo-gradient-text">Tivoa</span>
          </Link>
          <div className="relative flex items-center">
            <motion.div
              key={active.href}
              layout
              className="text-xl font-semibold"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <Link href={active.href} className="text-white">
                {active.label}
              </Link>
            </motion.div>
            <AnimatePresence>
              {expanded && (
                <motion.ul
                  className="flex items-center gap-6 ml-6"
                  initial="hide"
                  animate="show"
                  exit="hide"
                  variants={containerVariants}
                >
                  {rest.map((item) => (
                    <motion.li key={item.href} variants={itemVariants}>
                      <Link
                        href={item.href}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {item.label}
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile: Logo */}
        <div className="md:hidden flex items-center gap-3">
          <Link href="/" className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-green-300 to-green-600 bg-clip-text text-transparent">
              Tivoa
            </span>
          </Link>
          <span className="text-white font-semibold">{active.label}</span>
        </div>

        {/* Batch Action Bar (center, desktop) */}
        {show && (
          <div className="flex gap-4 absolute left-1/2 top-5 transform -translate-x-1/2">
            {/* Favorite/Unfavorite First */}
            {allFav && (
              <button
                className="flex items-center gap-1 hover:text-gray-400"
                onClick={() => onFavorite?.(false)}
                title="Unfavorite selected"
              >
                <HeartOff className="w-5 h-5" />
              </button>
            )}
            {allNotFav && (
              <button
                className="flex items-center gap-1 hover:text-pink-400"
                onClick={() => onFavorite?.(true)}
                title="Favorite selected"
              >
                <Heart className="w-5 h-5" />
              </button>
            )}
            {/* Download */}
            <button
              className="flex items-center gap-1 hover:text-green-400"
              onClick={onDownload}
              title="Download selected"
            >
              <Download className="w-5 h-5" />
            </button>
            {/* Delete */}
            <button
              className="flex items-center gap-1 hover:text-red-400"
              onClick={onDelete}
              title="Delete selected"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Right side: Logout/account/etc */}
        <div className="flex items-center gap-4">
          {isAccountPage ? (
            <button
              onClick={logout}
              disabled={loading}
              className="text-sm text-gray-400 hover:text-white flex items-center gap-2 disabled:opacity-50"
            >
              <LogOut className="w-5 h-5" />{" "}
              {loading ? "Logging out..." : "Logout"}
            </button>
          ) : (
            <>
              {/* Favorites toggle */}
              <div
                className="hidden md:flex items-center gap-2 border-none px-3 py-1 rounded-md hover:bg-gray-700/30 cursor-pointer"
                onClick={() => setShowFavorites?.(!showFavorites)}
              >
                {showFavorites ? "All Images" : "Favorites"}
                <Heart className="w-4 h-4 text-red-400" />
              </div>
              {/* View Dropdown (Grid) */}
              <div className="relative">
                <div
                  className="hidden md:flex items-center gap-2 border-none px-3 py-1 rounded-md hover:bg-gray-700/30 cursor-pointer"
                  onClick={() => setViewDropdown((v) => !v)}
                >
                  View <LayoutGrid className="w-4 h-4" />
                </div>
                {viewDropdown && (
                  <div
                    ref={dropdownRef}
                    className="absolute z-20 mt-2 left-0 bg-[#171717] border border-gray-700 rounded-lg shadow-lg py-1 px-2"
                  >
                    {[2, 3, 4, 5].map((cols) => (
                      <button
                        key={cols}
                        className={`flex items-center gap-2 w-full text-left px-4 py-2 text-sm rounded  transition`}
                        onClick={() => {
                          setGridCols?.(cols);
                          setViewDropdown(false);
                        }}
                      >
                        {cols}
                        {gridCols === cols && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Hamburger for mobile */}
              <button
                className="md:hidden"
                onClick={() => setMenuOpen((p) => !p)}
                aria-label="Toggle Menu"
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="flex flex-col mt-4 gap-2 md:hidden"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`cursor-pointer ${
                  pathname === item.href
                    ? "text-white font-semibold"
                    : "text-gray-400 hover:text-white"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {show && (
              <div className="flex gap-4 mt-2">
                <Trash2 className="w-5 h-5 cursor-pointer" />
                <Heart className="w-5 h-5 cursor-pointer" />
                <Download className="w-5 h-5 cursor-pointer" />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
