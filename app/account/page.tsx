"use client";

import React from "react";
import Link from "next/link";
import { Apple, Trash2, ShieldCheck, CreditCard, Key, UserCircle } from "lucide-react";
import Navbar from "@/components/Navbar";

const AccountPage: React.FC = () => {
  return (
    <>
    <Navbar />
    <section className="min-h-screen bg-black text-white px-6 py-10">
      
      <div className="space-y-10 max-w-2xl mx-auto">
        {/* Profile Section */}
        <div className="flex items-center space-x-5">
          <UserCircle className="w-14 h-14 text-gray-500" />
          <div>
            <h2 className="text-2xl font-semibold">rafay</h2>
            <p className="text-gray-400 text-sm">rafaymalik575763@gmail.com</p>
          </div>
        </div>

        {/* Credits Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-700 pb-4">
            <div>
              <p className="text-3xl font-bold">96</p>
              <p className="text-gray-400 text-sm">Free Credits</p>
              <p className="text-gray-500 text-xs mt-1">
                Auto-topped to 20 daily if below 20.
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold">0</p>
              <p className="text-gray-400 text-sm">Paid Credits</p>
            </div>
          </div>
          <div>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="$5"
                className="w-32 p-3 rounded-md bg-gray-600 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-md text-sm text-white font-medium shadow-md">
                Buy
              </button>
            </div>
            <p className="text-gray-400 text-xs mt-2">500 credits for $5</p>
            <Link href="#" className="text-purple-400 text-xs hover:underline mt-1 inline-block">
              Download receipts
            </Link>
          </div>
        </div>

        {/* Password Section */}
        <div className="space-y-3 border-t border-gray-700 pt-6">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Key className="w-4 h-4" /> Password
          </h3>
          <button className="bg-gray-700 hover:bg-gray-500 px-4 py-2 rounded-md text-sm w-max">Reset Password</button>
        </div>

        {/* Connected Accounts */}
        <div className="space-y-3 border-t border-gray-700 pt-6">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Connected Accounts
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <Apple className="w-5 h-5" />
              <span className="flex-1 text-gray-400 text-sm">Apple (Not Connected)</span>
              <button className="bg-gray-700 hover:bg-gray-500 px-3 py-1 rounded-md text-xs">Connect</button>
            </div>
            <div className="flex items-center gap-4">
              <CreditCard className="w-5 h-5" />
              <span className="flex-1 text-gray-400 text-sm">Google (Connected as rafaymalik575763@gmail.com)</span>
              <button className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded-md text-xs">Remove</button>
            </div>
          </div>
        </div>

        {/* Delete Account */}
        <div className="space-y-3 border-t border-gray-700 pt-6">
          <h3 className="text-white font-semibold">Delete Account</h3>
          <button className="bg-red-700 hover:bg-red-600 px-4 py-2 rounded-md text-sm flex items-center gap-2">
            <Trash2 className="w-4 h-4" /> Delete My Account
          </button>
        </div>

        {/* Footer Links */}
        <div className="flex gap-6 mt-10 text-xs text-gray-400 justify-center border-t border-gray-700 pt-6">
          <Link href="#" className="hover:underline">Terms & Conditions</Link>
          <Link href="#" className="hover:underline">Privacy Policy</Link>
        </div>
      </div>
    </section>
    </>

  );
};

export default AccountPage;