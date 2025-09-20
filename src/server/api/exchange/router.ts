import { createTRPCRouter, publicProcedure } from "../trpc"
import { queryBuyExchangeConfig, queryRedeemExchangeConfig } from "./queries"
import { z } from "zod"

export const exchangeRouter = createTRPCRouter({
    buyConfig: publicProcedure.input(z.object({ token_id: z.number() })).query(({ input, ctx }) => queryBuyExchangeConfig(input.token_id, ctx.rpcProvider)()),
    redeemConfig: publicProcedure.input(z.object({ token_id: z.number() })).query(({ input, ctx }) => queryRedeemExchangeConfig(input.token_id, ctx.rpcProvider)()),
})



