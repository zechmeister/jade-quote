import { type Offer } from "@/domain/quote";

type Props = {
  offer: Offer;
};

export default function Offer({ offer }: Props) {
  return (
    <div
      key={offer.termYears}
      className="rounded-lg border-2 border-gray-100 p-4 flex flex-col"
    >
      <h4 className="text-sm font-medium text-gray-600">
        {offer.termYears} years
      </h4>
      <p className="text-lg font-bold text-gray-900 mt-1">
        €{offer.monthlyPayment.toFixed(2)}/mo
      </p>
      <div className="mt-2 text-sm text-gray-600 space-y-1">
        <p>APR: {offer.apr}%</p>
        <p>Principal Used: €{offer.principalUsed}</p>
      </div>
    </div>
  );
}
