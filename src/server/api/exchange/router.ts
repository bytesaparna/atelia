import { revalidateTag } from "next/cache"
import { createTRPCRouter, publicProcedure } from "../trpc"
import { queryBuyExchangeConfig, queryRedeemExchangeConfig } from "./queries"
import { z } from "zod"
import { ExchangeContract__factory } from "@/src/contract-types"
import { getWalletSigner } from "@/src/lib/evm-helper"
import { parseEther } from "ethers"

export const exchangeRouter = createTRPCRouter({
    buyConfig: publicProcedure.input(z.object({ token_id: z.number() })).query(({ input, ctx }) => queryBuyExchangeConfig(input.token_id, ctx.rpcProvider)()),
    redeemConfig: publicProcedure.input(z.object({ token_id: z.number() })).query(({ input, ctx }) => queryRedeemExchangeConfig(input.token_id, ctx.rpcProvider)()),
    invalidateSharesCache: publicProcedure.input(z.object({ token_id: z.number() })).mutation(async ({ input }) => {
        revalidateTag(`buy-exchange-${input.token_id}`)
        return { success: true }
    }),
    buyShares: publicProcedure
        .input(z.object({ address: z.string(), amount: z.string() }))
        .mutation(async ({ input }) => {
            try {
                const signer = await getWalletSigner()
                const exchangeContract = ExchangeContract__factory.connect(input.address, signer)
                const tx = await exchangeContract.buy_with_native({ value: parseEther(input.amount) })
                console.log(tx.hash, "Transaction Hash")
                return { success: true, transactionHash: tx.hash }
            } catch (error) {
                console.error(error)
                return { success: false, transactionHash: null }
            }
        })
})
