// app/blocked/page.tsx
export default function BlockedPage({ searchParams }: { searchParams: any }) {
  const { email, name } = searchParams;
  return (
    <div className="min-h-screen flex items-center justify-center text-white bg-black">
      <div className="max-w-md space-y-4 text-center">
        <h1 className="text-2xl font-semibold">Account Blocked</h1>
        <p>
          Hi {name || "there"}, your account ({email}) is blocked. Please contact support.
        </p>
      </div>
    </div>
  );
}
