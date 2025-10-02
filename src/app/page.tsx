import QuoteFlow from "@/components/quote/QuoteFlow";
import { signIn, auth } from "@/infra/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div className="">
      <h1 className="text-4xl text-[#0EAD69] mt-8 text-center">JadeQuote</h1>
      {!session?.user && (
        <div className="flex flex-row gap-4">
          <form
            action={async () => {
              "use server";
              await signIn("keycloak");
            }}
          >
            <button
              type="submit"
              className="bg-[#0EAD69] border-2 border-[#0EAD69] text-white rounded-lg mt-8 px-4 py-2 hover:bg-[#0C975B] transition"
            >
              Login
            </button>
          </form>
          <form
            action={async () => {
              "use server";
              await signIn(
                "keycloak",
                { redirectTo: "/" },
                { prompt: "create" }
              );
            }}
          >
            <button
              type="submit"
              className="border-2 border-gray-200 text-gray-500 rounded-lg mt-8 px-4 py-2 hover:bg-gray-100 transition"
            >
              Register
            </button>
          </form>
        </div>
      )}

      <QuoteFlow />
    </div>
  );
}
