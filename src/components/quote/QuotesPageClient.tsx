"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QuotesList from "@/components/quote/QuotesList";
import type { Quote, QuoteRequest } from "@/domain/quote";

type QuoteData = {
  id: string;
  request: QuoteRequest;
  quote: Quote;
};

export default function QuotesPageClient() {
  const [quotes, setQuotes] = useState<QuoteData[] | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchQuotes() {
      try {
        const response = await fetch("/api/quotes");

        if (response.status === 401) {
          router.push("/api/auth/signin");
          return;
        }

        if (!response.ok) {
          setError(`Failed to load quotes: ${response.statusText}`);
          return;
        }

        setQuotes(await response.json());
      } catch (e) {
        setError((e as Error).message ?? "Failed to load quotes");
      }
    }

    setLoading(false);
    fetchQuotes();
  }, [router]);

  return (
    <div className="w-full py-8">
      <h1 className="text-2xl font-semibold mb-8 text-center">Past Quotes</h1>

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
