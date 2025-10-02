import { auth, signOut } from "@/infra/auth";
import Link from "next/link";

export default async function Header() {
  const session = await auth();

  return (
    <header className="w-full flex justify-between items-center pt-2">
      {session?.user && (
        <>
          <div className="flex flex-row gap-6">
            <Link href="/" className="text-sm hover:underline">
              ☀️
            </Link>
            <Link href="/quotes" className="text-sm hover:underline">
              My Quotes
            </Link>
            <Link href="/admin/quotes" className="text-sm hover:underline">
              All Quotes
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-right leading-4">
              <div className="font-medium">{session.user.name}</div>
              <div className="text-gray-600">{session.user.email}</div>
            </div>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="text-sm px-3 py-2 border-2 rounded-lg hover:bg-gray-100 transition border-gray-200 text-gray-500"
              >
                Logout
              </button>
            </form>
          </div>
        </>
      )}
    </header>
  );
}
