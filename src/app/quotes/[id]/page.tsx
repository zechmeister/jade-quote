import QuoteDetailClient from "./QuoteDetailClient";

export default async function QuoteDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <QuoteDetailClient id={id} />;
}
