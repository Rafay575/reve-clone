import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-xl w-full text-center">
        <h1 className="text-3xl font-bold text-indigo-700 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 mb-6">
          Welcome! Manage your users, settings, transactions, and more from here.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/admin/users"
            className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 transition"
          >
            Manage Users
          </Link>
          <Link
            href="/admin/settings"
            className="bg-green-50 text-green-700 px-4 py-2 rounded-lg font-medium hover:bg-green-100 transition"
          >
            App Settings
          </Link>
          <Link
            href="/admin/contactrequestspage"
            className="bg-yellow-50 text-yellow-800 px-4 py-2 rounded-lg font-medium hover:bg-yellow-100 transition"
          >
            Contact Requests
          </Link>
        </div>
      </div>
    </div>
  );
}
