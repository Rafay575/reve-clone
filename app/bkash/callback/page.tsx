"use client";
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { toast } from "sonner";

function CallbackContent() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const paymentID = searchParams.get("paymentID");
    if (!paymentID) {
      toast.error("Missing paymentID");
      setStatus("error");
      return;
    }
    (async () => {
      try {
        const res = await api.post("/credits/execute", { paymentID });
        toast.success("Payment successful!");
        setStatus("success");
        // router.replace("/thank-you");
      } catch (e: any) {
        toast.error(e.response?.data?.error || "Execute failed");
        setStatus("error");
      }
    })();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white bg-black">
      {status === "loading" && <p>Finalizing your payment…</p>}
      {status === "success" && <p>Payment successful ✅</p>}
      {status === "error" && <p>Payment failed ❌</p>}

      <button
        onClick={() => router.push("/")}
        className="mt-6 bg-gradient-to-r from-pink-500 to-red-400 px-4 py-2 rounded-md text-white font-medium hover:opacity-90"
      >
        Back to Home
      </button>
    </div>
  );
}

export default function BkashCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        Loading…
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}
