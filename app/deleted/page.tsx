// app/deleted/page.tsx
"use client";

import { useSearchParams } from "next/navigation";

export default function DeletedPage() {
  const params = useSearchParams();
  const email = params.get("email");
  const name = params.get("name");

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="max-w-md text-center p-6 bg-neutral-900 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Account Deleted</h1>
        <p>
          Hello <strong>{name || "User"}</strong>,
        </p>
        <p className="mt-2">
          Your account ({email}) has been permanently deleted. If you believe
          this was a mistake, please contact our support team.
        </p>
        <button
          onClick={() => (window.location.href = "/")}
          className="mt-6 bg-gradient-to-r from-red-400 to-pink-500 px-4 py-2 rounded-md text-white font-medium hover:opacity-90"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
