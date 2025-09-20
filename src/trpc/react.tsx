'use client'

import type React from "react"
import { QueryClientProvider } from "@tanstack/react-query"
import { api, queryClient, trpcClient } from "./clients"



export function TRPCReactProvider({ children }: { children: React.ReactNode }) {
  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </api.Provider>
  )
}


