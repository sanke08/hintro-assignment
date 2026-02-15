// src/app/providers/QueryProvider.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function QueryProvider({
  children,
  client,
}: {
  children: React.ReactNode;
  client: QueryClient;
}) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
