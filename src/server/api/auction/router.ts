import { revalidateTag } from "next/cache"
import { createTRPCRouter, publicProcedure } from "../trpc"
import { queryLatestAuctionBidders, queryLatestAuctionState } from "./queries"
import { z } from "zod"

export const auctionRouter = createTRPCRouter({
    latestAuctionState: publicProcedure.input(z.object({ token_id: z.number() })).query(({ input, ctx }) => queryLatestAuctionState(input.token_id, ctx.rpcProvider)()),
    highestBid: publicProcedure.input(z.object({ token_id: z.number() })).query(({ input, ctx }) => queryLatestAuctionBidders(input.token_id, ctx.rpcProvider)()),
    invalidateHighestBidCache: publicProcedure.input(z.object({ token_id: z.number() })).mutation(async ({ input }) => {
        revalidateTag(`latest_auction_bidder${input.token_id}`)
        return { success: true }
    })
})



