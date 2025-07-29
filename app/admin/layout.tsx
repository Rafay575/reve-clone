"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Users,
  Settings,
  Mail,
  Info,
  BookOpen,
  ShieldCheck,
  FileText,
} from "lucide-react";



const navItems = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/contactrequestspage", label: "Contact Requests", icon: Mail },
  { href: "/admin/abouteditor", label: "About Editor", icon: Info },
  { href: "/admin/TermsEditor", label: "Terms & Conditions", icon: FileText },
  { href: "/admin/PrivacyPolicyEditor", label: "Privacy Policy", icon: ShieldCheck },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-900 text-white p-6 space-y-6 md:min-h-screen">
        <h2 className="text-2xl font-bold mb-6 text-center md:text-left">Admin Panel</h2>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-800 transition text-sm font-medium",
                pathname === item.href && "bg-gray-800"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 bg-gray-50 text-black overflow-auto">
        {children}
      </main>
    </div>
  );
}