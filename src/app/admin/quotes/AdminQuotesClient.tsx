"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QuotesList from "@/components/quote/QuotesList";
import type { Quote, QuoteRequest } from "@/domain/quote";

export default function AdminQuotesClient() {
  const router = useRouter();

  const [quotes, setQuotes] = useState<
    | {
        request: QuoteRequest;
        quote: Quote;
      }[]
    | undefined
  >(undefined);
  const [searchTerm, setSearchTerm] = useState("");

  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const fetchQuotes = async (search?: string) => {
    setLoading(true);
    setError(undefined);

    try {
      const url = search
        ? `/api/admin/quotes?search=${encodeURIComponent(search)}`
        : "/api/admin/quotes";
      const response = await fetch(url);

      if (response.status === 401) {
        router.push("/api/auth/signin");
        return;
      }

      if (response.status === 403) {
        setError("Access denied. Admin privileges required.");
        return;
      }

      if (!response.ok) {
        setError(`Failed to load quotes: ${response.statusText}`);
        return;
      }

      setQuotes(await response.json());
    } catch (e) {
      setError((e as Error).message ?? "Failed to load quotes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, [router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchQuotes(searchTerm);
  };

  return (
    <div className="w-full py-8">
      <h1 className="text-2xl font-semibold mb-8 text-center">
        All Quotes <span className="font-light">(Admin)</span>
      </h1>

      <form onSubmit={handleSearch} className="mb-6 flex flex-row gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full border-2 rounded-lg px-3 py-2 border-gray-300"
        />
        <button
          type="submit"
          className="bg-[#0EAD69] border-2 border-[#0EAD69] text-white rounded-lg px-4 py-2 hover:bg-[#0C975B] transition"
        >
          Search
        </button>
        {searchTerm && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              fetchQuotes();
            }}
            className="border-2 border-gray-200 text-gray-500 rounded-lg px-4 py-2 hover:bg-gray-100 transition"
          >
            Clear
          </button>
        )}
      </form>

      {loading ? (
        <p className="text-gray-600 text-center">Loading...</p>
      ) : error ? (
        <div className="rounded border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm">
          {error}
        </div>
      ) : (
        <QuotesList quotes={quotes || []} />
      )}
    </div>
  );
}
