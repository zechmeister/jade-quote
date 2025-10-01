import Header from "@/components/Header";
import QuoteFlow from "@/components/quote/QuoteFlow";
import { signIn, auth } from "@/infra/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div className="min-h-screen flex justify-center">
      <div className="justify-items-center px-20 w-2xl">
        <Header />
        <h1 className="text-4xl text-[#0EAD69] mt-8">JadeQuote</h1>
        {!session?.user && (
          <form
            action={async () => {
              "use server";
              await signIn("keycloak");
            }}
          >
            <button
              type="submit"
              className="bg-[#0EAD69] text-white rounded-lg mt-8 px-4 py-2 hover:bg-[#0C975B] transition"
            >
              Login
            </button>
          </form>
        )}

        <QuoteFlow />
      </div>
    </div>
  );
}
