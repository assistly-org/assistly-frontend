"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function Providers({ children }: { children: React.ReactNode }) {
  // useState ensures the client isn't recreated on every render
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 min: data is "fresh", won't refetch on remount/focus...
            gcTime: 30 * 60 * 1000, // 30 min: how long unused data stays cached
            refetchOnWindowFocus: false, // don't refetch every time tab regains focus
            // refetchOnMount left at default (true): only refetches on mount if
            // data is stale OR invalidated. This is what makes invalidateQueries()
            // actually work after creating a tenant — removing this was the bug.
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}