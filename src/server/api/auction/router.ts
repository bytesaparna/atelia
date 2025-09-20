import { createTRPCRouter, publicProcedure } from "../trpc"
import { queryLatestAuctionBidders, queryLatestAuctionState } from "./queries"
import { z } from "zod"

export const auctionRouter = createTRPCRouter({
    latestAuctionState: publicProcedure.input(z.object({ token_id: z.number() })).query(({ input, ctx }) => queryLatestAuctionState(input.token_id, ctx.rpcProvider)()),
    highestBid: publicProcedure.input(z.object({ token_id: z.number() })).query(({ input, ctx }) => queryLatestAuctionBidders(input.token_id, ctx.rpcProvider)()),
})



