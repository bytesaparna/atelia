import { createTRPCRouter, publicProcedure } from "./trpc"
import { vfsRouter } from "./vfs/router"

export const appRouter = createTRPCRouter({
  health: publicProcedure.query(() => ({ status: "ok" })),
  vfs: vfsRouter,
})

export type AppRouter = typeof appRouter


