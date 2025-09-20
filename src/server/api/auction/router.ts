import { createTRPCRouter, publicProcedure } from "../trpc"
import { queryLatestAuctionState } from "./queries"
import { z } from "zod"

export const auctionRouter = createTRPCRouter({
    latestAuctionState: publicProcedure.input(z.object({ token_id: z.number() })).query(({ input, ctx }) => queryLatestAuctionState(input.token_id, ctx.rpcProvider)()),
})



