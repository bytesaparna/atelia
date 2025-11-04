import { createTRPCRouter, publicProcedure } from "../trpc";
import { fechTokenUri, queryAllTokens, queryNftCollection, queryNftCollections, queryTokenState, queryUserShareBalanceOfAllNfts } from "./queries";
import { z } from "zod";

export const collectionsRouter = createTRPCRouter({
    nftCollections: publicProcedure.query(({ ctx }) =>
        queryNftCollections(ctx.rpcProvider)
    ),
    
    nftCollection: publicProcedure
        .input(
            z.object({
                token_id: z.number(),
            })
        )
        .query(({ input, ctx }) =>
            queryNftCollection(
                input.token_id,
                ctx.rpcProvider
            )
        ),

    tokenState: publicProcedure
        .input(
            z.object({
                token_id: z.number(),
            })
        )
        .query(({ input, ctx }) =>
            queryTokenState(input.token_id, ctx.rpcProvider)
        ),

    allTokens: publicProcedure.query(({ ctx }) =>
        queryAllTokens(ctx.rpcProvider)
    ),

    fechTokenUri: publicProcedure.input(z.object({ uri: z.string() })).query(({ input }) =>
        fechTokenUri(input.uri)
    ),

    userSharesBalanceOfAllNfts: publicProcedure.input(z.object({ userAddress: z.string() })).query(({ input, ctx }) =>
        queryUserShareBalanceOfAllNfts(input.userAddress, ctx.rpcProvider)
    )
});
