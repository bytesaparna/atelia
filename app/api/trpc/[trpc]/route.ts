import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
import { appRouter } from "@/src/server/api/root"
import { createTRPCContext } from "@/src/server/api/trpc"

const handler = (req: Request) =>
    fetchRequestHandler({
        endpoint: "/api/trpc",
        req,
        router: appRouter,
        createContext: async (opts) => createTRPCContext(opts),
    })

export { handler as GET, handler as POST }


