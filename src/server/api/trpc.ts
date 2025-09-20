import { initTRPC } from "@trpc/server"
import superjson from "superjson"
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch"
import { JsonRpcProvider } from "ethers"

export type CreateContextOptions = FetchCreateContextFnOptions

export async function createTRPCContext(_opts: CreateContextOptions) {
  // Add auth/session/db connections to context here as needed
  return {
    rpcProvider: new JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL),
  }
}

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>

const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
})

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure


