import RequestForm from "@/components/quote/RequestForm";
import { QuoteForm } from "@/components/QuoteForm";

export default function Home() {
  return (
    <div className="justify-items-center p-20">
      <h1 className="text-4xl text-[#0EAD69]">JadeQuote</h1>
      <RequestForm />
    </div>
  );
}
