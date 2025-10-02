"use client";

import QuoteResult from "@/components/quote/QuoteResult";
import { Quote } from "@/domain/quote";
import router from "next/router";
import { useEffect, useState } from "react";

type Props = { id: string };

export default function QuoteDetailClient({ id }: Props) {
  const [quote, setQuote] = useState<Quote | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function fetchQuote() {
      try {
        const response = await fetch(`/api/quotes/${id}`);

        if (response.status === 401) {
          router.push("/api/auth/signin");
          return;
        }

        if (!response.ok) {
          setError(`Failed to load quote: ${response.statusText}`);
          return;
        }
        setQuote((await response.json()).quote);
      } catch (e) {
        setError((e as Error).message ?? "Failed to load quote");
      }
    }

    fetchQuote();
  }, [id]);

  return (
    <div className="w-full py-8">
      {quote ? (
        <QuoteResult quote={quote} />
      ) : error ? (
        <div className="rounded border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm">
          {error}
        </div>
      ) : (
        <p className="text-gray-600 text-center">Loading...</p>
      )}
    </div>
  );
}
