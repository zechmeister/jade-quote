"use client";

import type { Quote, QuoteRequest } from "@/domain/quote";
import QuoteResult from "./QuoteResult";

type Props = {
  quotes: { request: QuoteRequest; quote: Quote }[];
};

export default function QuotesList({ quotes }: Props) {
  if (quotes.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No quotes yet.</p>
      </div>
    );
  }

  return (
    <>
      <ul className="grid gap-4">
        {quotes.map(({ quote }) => (
          <li key={`quote-${quote.id}`}>
            <QuoteResult quote={quote} />
          </li>
        ))}
      </ul>
    </>
  );
}
