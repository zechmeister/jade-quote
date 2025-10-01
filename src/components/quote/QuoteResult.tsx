import { Quote } from "@/domain/quote";
import Offer from "./Offer";

type Props = {
  quote: Quote;
};

export default function QuoteResult({ quote }: Props) {
  return (
    <div className="max-w-2xl mx-auto mt-8 rounded-xl border-2 border-gray-100 p-6 space-y-6">
      <div className="flex justify-between items-start mb-10">
        <div>
          <h2 className="mb-1 text-xs uppercase font-bold tracking-wider text-gray-500">
            System Price
          </h2>
          <p className="text-2xl font-bold text-gray-900">
            €{quote.systemPrice.toLocaleString()}
          </p>
        </div>
        <div className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
          Risk Band: <span className="font-bold">{quote.riskBand}</span>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-xs uppercase font-bold tracking-wider text-gray-500">
          Offers
        </h3>
        <ul className="grid gap-4 grid-cols-3">
          {quote.offers.map((offer, index) => (
            <li key={`offer-${index}`}>
              <Offer offer={offer} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
