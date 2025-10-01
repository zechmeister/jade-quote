import { auth, signIn, signOut } from "@/infra/auth";

export default async function Header() {
  const session = await auth();

  return (
    <header className="w-full place-items-end pt-2">
      {session?.user && (
        <div className="flex items-center gap-4">
          <div className="text-sm text-right leading-4">
            <div className="font-medium">{session.user.name}</div>
            <div className="text-gray-600">{session.user.email}</div>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button
              type="submit"
              className="text-sm px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Logout
            </button>
          </form>
        </div>
      )}
    </header>
  );
}
