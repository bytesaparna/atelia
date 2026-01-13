import { KernelContract__factory } from "@/src/contract-types";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { fechTokenUri, queryAllTokens, queryNftCollection, queryNftCollections, queryTokenState, queryUserShareBalanceOfAllNfts } from "./queries";
import { z } from "zod";
import { getTokensContract, getWalletSigner, RPC_PROVIDER } from "@/src/lib/evm-helper";
import type { IKernelContract, AmpMsgLib } from "@/src/contract-types/KernelContract";
import { createBatchMessageBuilder } from "./batch-message";
import { revalidateTag } from "next/cache";
import { queryResolvePath } from "../vfs/queries";
import { APP_CONFIG } from "@/src/config/app-config";


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
    ),

    setupDesignSale: publicProcedure
        .input(
            z.object({
                token_id: z.string(),
                buyDuration: z.string(),
                auctionDuration: z.string(),
                gapDuration: z.string(),
            })
        )
        .mutation(async ({ input }) => {
            const buyDuration = BigInt(input.buyDuration);
            const auctionDuration = BigInt(input.auctionDuration);
            const gapDuration = BigInt(input.gapDuration);
            const auctionStartTime = buyDuration + gapDuration;
            const redeemStartTime = auctionStartTime + auctionDuration;

            const signer = await getWalletSigner();
            const owner = await signer.getAddress();
            const kernelAddress = process.env.NEXT_PUBLIC_KERNEL_ADDRESS;
            const appOwner = process.env.NEXT_PUBLIC_OWNER_ADDRESS;
            if (!appOwner) {
                throw new Error("NEXT_PUBLIC_OWNER_ADDRESS is not configured.");
            }

            //TODO later- need to update the token id dynamically
            //token id used till 15. For next use 16 and that update 
            const builder = createBatchMessageBuilder({ owner, tokenId: "16", tokenUri: `https://atelia.vercel.app/tokens/design-${input.token_id}.json` })

            const messages: IKernelContract.BatchMessageStruct[] = [
                builder.encodedMintMessage,
                builder.setupShares(),
                builder.setUpBuyExchange(buyDuration.toString()),
                builder.setUpRedeemExchange(redeemStartTime.toString()),
                builder.approveSharesToExchange(),
                builder.startExchange(),
                builder.approveNftToAuction(),
                builder.startAuction(auctionStartTime.toString(), auctionDuration.toString()),
            ];

            const kernel = KernelContract__factory.connect(kernelAddress, signer);
            const tx = await kernel.batch_messages(messages);
            await tx.wait();

            return {
                success: true,
                transactionHash: tx.hash,
            };
        }),

    invalidateCollectionsCache: publicProcedure.mutation(async () => {
        revalidateTag("collections");
        return {
            success: true,
        };
    }),


});


