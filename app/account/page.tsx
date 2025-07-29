"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getUserMe } from "@/lib/authApi";
import { toast } from "sonner";
import { FaGoogle, FaUserCircle } from "react-icons/fa";
import { FiKey, FiDownload } from "react-icons/fi";
import { previewCredits, initiateBkash } from "@/lib/credits";
import { useRouter } from "next/navigation";
import ResetPasswordDialog from "@/components/ResetPasswordDialog";
import DeleteAccountDialog from "@/components/DeleteAccountDialog";
import {api} from "@/lib/axios";
type UserData = {
  name: string;
  email: string;
  google_id: string | null;
  credits: number;
};
const MIN_USD = 1;

const parseUSD = (v: string) => {
  const n = parseFloat(v.replace(/[^0-9.]/g, ""));
  return isNaN(n) ? 0 : n;
};

const formatUSD = (n: number) => `$ ${n.toFixed(2)}`;

const AccountPage: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [buyAmount, setBuyAmount] = useState<string>(formatUSD(5));
  const [buyLoading, setBuyLoading] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

const [creditSettings, setCreditSettings] = useState<{usdToBdt: number, creditsPerDollar: number} | null>(null);

useEffect(() => {
  // Existing user fetch
  const fetchUser = async () => {
    try {
      const res = await getUserMe();
      setUser(res.data.user);
    } catch (err: any) {
      toast.error("Failed to load account details");
    } finally {
      setLoading(false);
    }
  };
  fetchUser();

  // Fetch credit settings
  const fetchSettings = async () => {
    try {
      const res = await api.get("/settings/credits");
      setCreditSettings(res.data);
    } catch (e) {
      toast.error("Failed to load credits settings");
    }
  };
  fetchSettings();
}, []);

const downloadPDF = async () => {
  try {
    const res = await api.get(
      "/transactions/receipts",
      { responseType: "blob" } // <-- This is required!
    );

    // res.data is now a Blob (PDF file)
    const url = window.URL.createObjectURL(res.data);
    const a = document.createElement("a");
    a.href = url;
    a.download = "receipts.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (e) {
    toast.error("Download failed");
  }
};



  const firstLetter = user?.name?.[0]?.toUpperCase() || "U";

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseUSD(e.target.value);
    setBuyAmount(formatUSD(raw));
  };

  const handleBuy = async () => {
    const amount = parseUSD(buyAmount);
    const clamped = Math.max(MIN_USD, amount);

    try {
      setBuyLoading(true);
      const preview = await previewCredits(clamped);
      toast.success(
        `$${preview.amountUSD} → ${preview.credits} credits (logged on server)`
      );
      setBuyAmount(formatUSD(preview.amountUSD));
      const { bkashURL } = await initiateBkash(preview.amountUSD);
      window.location.href = bkashURL;
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Failed to initiate payment");
    } finally {
      setBuyLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <section className="min-h-screen bg-black text-white px-6 py-10">
        <div className="max-w-2xl mx-auto space-y-10">
          {/* PROFILE */}
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 flex items-center justify-center logo-gradient-btn rounded-full text-xl font-bold">
              {loading ? <FaUserCircle className="w-8 h-8" /> : firstLetter}
            </div>
            <div>
              {loading ? (
                <p className="text-gray-400">Loading...</p>
              ) : (
                <>
                  <h2 className="text-2xl font-semibold">{user?.name}</h2>
                  <p className="text-gray-400 text-sm">{user?.email}</p>
                </>
              )}
            </div>
          </div>

          {/* CREDITS */}
          <div className="space-y-6">
            <div>
              <p className="text-4xl font-semibold">{user?.credits ?? 0}</p>
              <h4 className="mt-1 font-medium">Free Credits</h4>
              <p className="text-gray-400 text-sm mt-2">
                These are used before your paid credits. If you have fewer than
                20 free credits, we&apos;ll top you back up to 20 everyday.
              </p>
            </div>
            <div className="mt-6">
              <p className="text-4xl font-semibold">{user?.credits ?? 0}</p>
              <h4 className="mt-1 font-medium">Paid Credits</h4>
              <p className="text-gray-400 text-sm mt-2">
                Generating an image uses 1 credit
              </p>
            </div>
            <div className="mt-6">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={buyAmount}
                  onChange={handleAmountChange}
                  className="w-full bg-[#111] text-white border-0 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
                <button
                  onClick={handleBuy}
                  disabled={buyLoading}
                  className="h-10 !w-20 text-xs rounded-md border border-white/20 hover:bg-white/10 transition disabled:opacity-50"
                >
                  {buyLoading ? "..." : "Buy"}
                </button>
              </div>
           <p className="text-gray-400 text-xs mt-2">
  1 USD = {creditSettings?.creditsPerDollar ?? 100} credits
  {" "}
  (e.g. $5 = {creditSettings ? 5 * creditSettings.creditsPerDollar : 500} credits)
</p>

              <button
                onClick={downloadPDF}
                className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white mt-4"
              >
                <FiDownload className="w-4 h-4" />
                Download receipts
              </button>
            </div>
          </div>

          <hr className="border-white/10" />

          {/* PASSWORD */}
          <div className="space-y-3 flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold flex items-center gap-2">
                <FiKey className="w-4 h-4" /> Password
              </h3>
              <p className="text-sm text-gray-400">Reset your password</p>
            </div>
            <button
              onClick={() => setResetOpen(true)}
              className="h-10 w-20 text-xs rounded-md border border-white/20 hover:bg-white/10 transition"
            >
              Reset
            </button>
            <ResetPasswordDialog open={resetOpen} onOpenChange={setResetOpen} />
          </div>

          <hr className="border-white/10" />

          {/* CONNECTED ACCOUNTS */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Connected accounts</h3>
            <div className="mt-4">
              <p className="text-sm text-gray-300 mb-2 flex items-center gap-2">
                <FaGoogle className="w-4 h-4" /> Google
              </p>
              {user?.google_id ? (
                <div className="flex items-center gap-3 rounded-md p-3">
                  <div className="flex-1">
                    <p className="text-sm text-gray-300">Connected</p>
                    <p className="text-xs text-gray-500">
                      Signed in as {user?.email}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="h-9 px-3 text-xs rounded-md border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <button className="flex items-center gap-2 h-9 px-4 rounded-md bg-white text-black text-sm hover:opacity-90 transition">
                  <FaGoogle className="w-4 h-4" />
                  Connect Google
                </button>
              )}
            </div>
          </div>

          <hr className="border-white/10" />

          {/* DELETE ACCOUNT */}
          <div className="space-y-3 flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold">Delete account</h3>
              <p className="text-sm text-gray-400">
                Permanently delete your Reve account
              </p>
            </div>
            <button
              className="h-10 w-20 text-center text-xs rounded-md border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition flex justify-center items-center gap-2"
              onClick={() => setOpen(true)}
            >
              Delete
            </button>
            <DeleteAccountDialog open={open} onOpenChange={setOpen} />
          </div>

          {/* FOOTER LINKS */}
          <div className="pt-10 border-t border-white/10 flex items-center justify-center gap-6 text-xs text-white/50">
            <button
              onClick={() => router.push("termspage")}
              className="hover:text-white underline-offset-4 hover:underline bg-transparent"
            >
              Terms & Conditions
            </button>
            <button
              onClick={() => router.push("/privacypolicy")}
              className="hover:text-white underline-offset-4 hover:underline bg-transparent"
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </section>

      {/* Dialogs */}
    </>
  );
};

export default AccountPage;
