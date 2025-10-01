"use client";

import { useState } from "react";
import RequestForm from "./RequestForm";
import { Quote, QuoteRequest } from "@/domain/quote";
import QuoteResult from "./QuoteResult";
import { User } from "@/domain/user";

type Props = {
  user: User;
};

export default function QuoteFlowClient({ user }: Props) {
  const [quote, setQuote] = useState<Quote | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  async function getQuote(request: QuoteRequest) {
    setError(undefined);

    try {
      const result = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      if (!result.ok) {
        setError(`Could not get Quote: ${result.statusText}.`);
        return;
      }

      setQuote(await result.json());
    } catch (e) {
      setError((e as Error).message ?? "Could not get Quote.");
    }
  }

  if (quote) {
    return <QuoteResult quote={quote} />;
  }

  return (
    <>
      {error && (
        <div className="mb-2 mt-8 rounded border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm">
          {error}
        </div>
      )}

      <RequestForm onSubmit={getQuote} user={user} />
    </>
  );
}
