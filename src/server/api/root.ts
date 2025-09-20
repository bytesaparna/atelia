import { auctionRouter } from "./auction/router"
import { collectionsRouter } from "./collections/router"
import { exchangeRouter } from "./exchange/router"
import { createTRPCRouter, publicProcedure } from "./trpc"
import { vfsRouter } from "./vfs/router"

export const appRouter = createTRPCRouter({
  health: publicProcedure.query(() => ({ status: "ok" })),
  vfs: vfsRouter,
  auction: auctionRouter,
  exchange: exchangeRouter,
  collections: collectionsRouter
})

export type AppRouter = typeof appRouter


