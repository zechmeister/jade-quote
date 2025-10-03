"use client";

import type { Quote, QuoteRequest } from "@/domain/quote";
import { useRouter } from "next/navigation";

type Props = {
  quotes: { request: QuoteRequest; quote: Quote }[];
};

export default function QuotesList({ quotes }: Props) {
  const router = useRouter();

  if (quotes.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No quotes yet.</p>
      </div>
    );
  }

  return (
    <table className="w-full">
      <thead>
        <tr>
          <th className="text-left p-2">User</th>
          <th className="text-left p-2">email</th>
          <th className="text-left p-2">Date</th>
          <th className="text-left p-2">System Size</th>
          <th className="text-right p-2">Price</th>
          <th className="text-center p-2">Band</th>
        </tr>
      </thead>
      <tbody>
        {quotes.map(({ request, quote }) => (
          <tr
            key={quote.id}
            onClick={() => router.push(`/quotes/${quote.id}`)}
            className="cursor-pointer hover:bg-gray-100"
          >
            <td className="text-left p-2">{quote.user.name}</td>
            <td className="text-left p-2">{quote.user.email}</td>
            <td className="text-left p-2">
              {new Date(quote.createdAt).toLocaleDateString()}
            </td>
            <td className="text-left p-2">{request.systemSizeKw} kW</td>
            <td className="text-right p-2">${quote.systemPrice}</td>
            <td className="text-center p-2">{quote.riskBand}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
