import { AppContract__factory, AuctionContract__factory, Cw20Contract__factory, Cw721Contract__factory, ExchangeContract__factory, KernelContract__factory, SplitterContract__factory } from "@/src/contract-types";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { fechTokenUri, queryAllTokens, queryNftCollection, queryNftCollections, queryTokenState, queryUserShareBalanceOfAllNfts } from "./queries";
import { z } from "zod";
import { getSharesContract, getWalletSigner } from "@/src/lib/evm-helper";
import { AbiCoder, BytesLike, Fragment, FunctionFragment, ParamType } from "ethers";
import type { IKernelContract, AmpMsgLib } from "@/src/contract-types/KernelContract";
import type { ICw20Contract } from "@/src/contract-types/Cw20Contract";
import type { IAppContract } from "@/src/contract-types/AppContract";

import { APP_CONFIG } from "@/src/config/app-config";
import { Abi } from "viem";
import { SplitterContractStorage } from "@/src/contract-types/SplitterContract";
import type { RecipientLib } from "@/src/contract-types/SplitterContract";
import { IExchangeContract } from "@/src/contract-types/ExchangeContract";
import { AssetLib, ScheduleLib } from "@/src/contract-types/ExchangeContract";


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
                // owner: z.string(),
                contract_address: z.string(),
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

            const BATCH_MESSAGE_TYPE = {
                EXECUTE_ADO: 0,
                INSTANTIATE_ADO: 1,
            } as const;


            const abiCoder = AbiCoder.defaultAbiCoder();


            const cw721Interface = Cw721Contract__factory.createInterface();
            const cw20Interface = Cw20Contract__factory.createInterface();
            const kernelInterface = KernelContract__factory.createInterface();
            const exchangeInterface = ExchangeContract__factory.createInterface();
            const auctionInterface = AuctionContract__factory.createInterface();
            const appInterface = AppContract__factory.createInterface();
            const splitterInterface = SplitterContract__factory.createInterface();


            const SHARES_SUPPLY = BigInt("5000000000000000000000");
            const BUY_EXCHANGE_RATE_BPS = BigInt("50000000"); // 1 ETH = 5000 ATELIA
            const REDEEM_EXCHANGE_RATE_BPS = BigInt("10000") / BigInt("5000"); // 1 ATELIA = 1/5000 ETH
            const MIN_BID = (SHARES_SUPPLY * REDEEM_EXCHANGE_RATE_BPS) / BigInt("10000");
            const native = "stt";


            // const redeemExchangeComponent: IAppContract.AppComponentParamStruct = {
            //     name: `redeem-shares-${input.token_id}`,
            //     ado_type: "exchange@0.1.0",
            //     instantiate_msg: exchangeInterface.encodeFunctionData("initialize", [{
            //         owner: input.owner,
            //         from_asset: { native: "", smart: APP_CONFIG.shares_address(Number(input.token_id)) },
            //         to_asset: { native: "stt", smart: "" },
            //         recipient: { recipient: input.owner, message: "0x" },
            //         exchange_rate_bps: REDEEM_EXCHANGE_RATE_BPS,
            //         schedule: redeemSchedule,
            //     }]),
            // };



            // const approveSharesMessage: IKernelContract.BatchMessageStruct = {
            //     message_type: BATCH_MESSAGE_TYPE.EXECUTE_ADO,
            //     data: encodeBatchExecute(
            //         APP_CONFIG.buy_exchange_address(Number(input.token_id)),
            //         cw20Interface.encodeFunctionData("approve(string,uint256)", [APP_CONFIG.buy_exchange_address(Number(input.token_id)), SHARES_SUPPLY])
            //     ),
            // };

            // const startExchangeMessage: IKernelContract.BatchMessageStruct = {
            //     message_type: BATCH_MESSAGE_TYPE.EXECUTE_ADO,
            //     data: encodeBatchExecute(
            //         APP_CONFIG.buy_exchange_address(Number(input.token_id)),
            //         exchangeInterface.encodeFunctionData("add_funds_erc20", [SHARES_SUPPLY])
            //     ),
            // };

            // const approveNftMessage: IKernelContract.BatchMessageStruct = {
            //     message_type: BATCH_MESSAGE_TYPE.EXECUTE_ADO,
            //     data: encodeBatchExecute(
            //         APP_CONFIG.token_address(),
            //         cw721Interface.encodeFunctionData("approve(string,uint256)", [APP_CONFIG.auction_address(), input.token_id])
            //     ),
            // };

            // const auctionSplitterConfig: SplitterContractStorage.SplitterConfigStruct[] = [
            //     {
            //         recipient: { recipient: input.owner, message: "0x" },
            //         split_bps: 500,
            //     },
            //     {
            //         recipient: {
            //             recipient: APP_CONFIG.redeem_exchange_address(Number(input.token_id)),
            //             message: exchangeInterface.encodeFunctionData("add_funds_native_dynamic", [{ max_inflow_amount: SHARES_SUPPLY }]),
            //         },
            //         split_bps: 9500,
            //     },
            // ];

            // const auctionSplitterMessage = splitterInterface.encodeFunctionData("send_native", [auctionSplitterConfig]);

            // const startAuctionMessage: IKernelContract.BatchMessageStruct = {
            //     message_type: BATCH_MESSAGE_TYPE.EXECUTE_ADO,
            //     data: encodeBatchExecute(
            //         APP_CONFIG.auction_address(),
            //         auctionInterface.encodeFunctionData("start_auction", [{
            //             token_id: Number(input.token_id),
            //             min_bid: MIN_BID,
            //             min_raise: parseUnits("0.05", 18),
            //             schedule: auctionSchedule,
            //             recipient: { recipient: APP_CONFIG.splitter_address(), message: auctionSplitterMessage } as AuctionRecipientLib.RecipientStruct,
            //             bid_asset: { native: "stt", smart: "" } as AuctionAssetLib.AssetStruct,
            //             buy_now_price: MIN_BID * 10,
            //         } satisfies IAuctionContract.StartAuctionParamsStruct])
            //     ),
            // };


            // STEP1 - MINTING THE TOKEN USING ERC721
            const mintTokenMessage: IKernelContract.BatchExecuteAdoParamsStruct = {
                amp_msg: {
                    recipient: APP_CONFIG.token_address(),
                    message: cw721Interface.encodeFunctionData("mint_with_uri", [owner, "104", `https://atelia.vercel.app/tokens/design-${input.token_id}.json`]),
                    funds: BigInt(0),
                    config: { exit_at_error: true },
                } as AmpMsgLib.AmpMsgStruct
            }

            const batchExecuteAdoParamsStruct = getStructAbi(KernelContract__factory.abi, "struct IKernelContract.BatchExecuteAdoParams");
            if (!batchExecuteAdoParamsStruct) {
                throw new Error("BatchExecuteAdoParams struct not found");
            }
            console.dir(batchExecuteAdoParamsStruct, { depth: null });

            const encodedMintMessage: IKernelContract.BatchMessageStruct = {
                message_type: BATCH_MESSAGE_TYPE.EXECUTE_ADO,
                data: abiCoder.encode([batchExecuteAdoParamsStruct], [mintTokenMessage])
            }

            const createAddAppComponentExecuteMessage = (name: string, adoType: string, instantiate_msg: BytesLike): IKernelContract.BatchMessageStruct => {
                const addAppComponentMessage: IAppContract.AppComponentParamStruct = {
                    name: name,
                    ado_type: adoType,
                    instantiate_msg: instantiate_msg
                }

                const addAppComponentParamsStruct = getStructAbi(AppContract__factory.abi, "struct IAppContract.AppComponentParam");
                if (!addAppComponentParamsStruct) {
                    throw new Error("AppComponentParamStruct struct not found");
                }

                const encodedAddAppComponentMessage = appInterface.encodeFunctionData(
                    "add_app_component",
                    [addAppComponentMessage],
                )

                const batchExecuteMessage: IKernelContract.BatchExecuteAdoParamsStruct = {
                    amp_msg: {
                        recipient: APP_CONFIG.address,
                        message: encodedAddAppComponentMessage,
                        funds: BigInt(0),
                        config: { exit_at_error: true },
                    } as AmpMsgLib.AmpMsgStruct
                }
                const encodeBatchExecute = abiCoder.encode([batchExecuteAdoParamsStruct], [batchExecuteMessage])

                const message: IKernelContract.BatchMessageStruct = {
                    message_type: BATCH_MESSAGE_TYPE.EXECUTE_ADO,
                    data: encodeBatchExecute
                }

                return message;
            }

            // STEP2 - MINTING SHARES USING ERC20
            const setupShares = (tokenId: string): IKernelContract.BatchMessageStruct => {
                const initialBalances: ICw20Contract.InitialBalanceStruct[] = [
                    {
                        account: owner,
                        amount: SHARES_SUPPLY,
                    },
                ];

                const cw20ContractMessage: ICw20Contract.Cw20ContractInitParamsStruct = {
                    owner: owner,
                    name: `ATELIA${tokenId}`,
                    symbol: `ATELIA${tokenId}`,
                    decimals: 18,
                    minter: {
                        minter: owner,
                        cap: 0,
                    } as ICw20Contract.MinterStruct,
                    initialBalances: initialBalances,
                }

                const encodeCw20ContractMessage = cw20Interface.encodeFunctionData("initialize", [cw20ContractMessage])

                const sharesMessage = createAddAppComponentExecuteMessage(`shares-${tokenId}`, "cw20@0.1.0", encodeCw20ContractMessage)
                console.log("sharesMessage");
                console.dir(sharesMessage, { depth: null });
                return sharesMessage;
            }


            // STEP3 - SETUP BUY Exchange 
            const setUpBuyExchange = (tokenId: string, buyDuration: string): IKernelContract.BatchMessageStruct => {
                const config: SplitterContractStorage.SplitterConfigStruct[] = [
                    {
                        recipient: {
                            recipient: owner,
                            message: "0x"
                        } as RecipientLib.RecipientStruct,
                        split_bps: 1000,
                    },
                    {
                        recipient: {
                            recipient: owner,
                            message: "0x"
                        } as RecipientLib.RecipientStruct,
                        split_bps: 9000,
                    }
                ]
                const encodedSplitterMessage = splitterInterface.encodeFunctionData("send_native", [config]);
                const exchangeContractMessage: IExchangeContract.ExchangeContractInitParamsStruct = {
                    owner: owner,
                    from_asset: { native: native, smart: "" } as AssetLib.AssetStruct,
                    to_asset: {
                        native: "",
                        smart: APP_CONFIG.shares_address(Number(tokenId))
                    } as AssetLib.AssetStruct,
                    recipient: {
                        recipient: APP_CONFIG.splitter_address(),
                        message: encodedSplitterMessage
                    } as RecipientLib.RecipientStruct,
                    exchange_rate_bps: BUY_EXCHANGE_RATE_BPS,
                    schedule: {
                        start: {
                            from_now: 0,
                            at_time: 0,
                            infinite: false
                        } as ScheduleLib.ExpiryStruct,
                        end: {
                            from_now: buyDuration,
                            at_time: 0,
                            infinite: false
                        } as ScheduleLib.ExpiryStruct,
                    } as ScheduleLib.ScheduleStruct,
                }

                const encodedExchangeContractMessage = exchangeInterface.encodeFunctionData("initialize", [exchangeContractMessage])

                const message = createAddAppComponentExecuteMessage(`buy-shares-${tokenId}`, "exchange@0.1.0", encodedExchangeContractMessage)
                return message;
            }


            const messages: IKernelContract.BatchMessageStruct[] = [
                encodedMintMessage,
                setupShares("104"),
                setUpBuyExchange("104", buyDuration.toString()),
                // addComponentMessage(buyExchangeComponent),
                // addComponentMessage(redeemExchangeComponent),
                // approveSharesMessage,
                // startExchangeMessage,
                // approveNftMessage,
                // startAuctionMessage,
            ];

            const kernel = KernelContract__factory.connect(kernelAddress, signer);
            const tx = await kernel.batch_messages(messages);
            await tx.wait();

            return {
                success: true,
                transactionHash: tx.hash,
            };
        }),


});



function getStructAbi(abi: any, internalType: string): ParamType | null {
    for (const f of abi) {
        const inputs = f.inputs || [];
        for (const inp of inputs) {
            if (inp.internalType === internalType) return cleanParamType(inp);
            // also search recursively
            if (inp.components) {
                const found = getStructAbi(inp.components, internalType);
                if (found) return cleanParamType(found);
            }
        }
    }
    return null;
}

function cleanParamType(obj: any): ParamType {
    const clone = { ...obj };
    delete clone.indexed;    // ← remove the root indexed

    if (clone.components) {
        clone.components = clone.components.map(cleanParamType); // ← remove nested indexed
    }

    return clone;
}
