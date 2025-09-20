import { createTRPCRouter, publicProcedure } from "../trpc"
import { queryResolvePath } from "./queries"
import { z } from "zod"

export const vfsRouter = createTRPCRouter({
    resolvePath: publicProcedure.input(z.object({ path: z.string() })).query(({ input }) => queryResolvePath(input.path)()),
})



