import { initTRPC } from "@trpc/server"
import superjson from "superjson"
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch"
import { RPC_PROVIDER } from "@/src/lib/evm-helper"

export type CreateContextOptions = FetchCreateContextFnOptions

export async function createTRPCContext(_opts: CreateContextOptions) {
  // Add auth/session/db connections to context here as needed
  return {
    rpcProvider: RPC_PROVIDER,
  }
}

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>

const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
})

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure


