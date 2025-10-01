import { auth } from "@/infra/auth";
import QuoteFlowClient from "./QuoteFlowClient";

export default async function QuoteFlow() {
  const session = await auth();

  if (!session?.user?.email || !session?.user?.name) return null;

  return (
    <QuoteFlowClient
      user={{
        name: session.user.name,
        email: session.user.email,
      }}
    />
  );
}
