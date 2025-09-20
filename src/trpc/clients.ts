'use client'
import { QueryClient } from "@tanstack/react-query"
import { createTRPCReact, httpBatchLink } from "@trpc/react-query"
import type { AppRouter } from "@/src/server/api/root"
import SuperJSON from "superjson"

export const queryClient = new QueryClient()

export const api = createTRPCReact<AppRouter>()


export const trpcClient = api.createClient({
    links: [
        httpBatchLink({
            url: "/api/trpc",
            transformer: SuperJSON,
            headers() {
                return {
                    "x-trpc-source": "nextjs-react",
                }
            },
        }),
    ],
})