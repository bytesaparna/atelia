import { AppContract__factory, KernelContract__factory } from "@/src/contract-types";
import { AbiCoder, BytesLike } from "ethers";
import { getStructAbi } from "./fuctions";
import { APP_CONFIG } from "@/src/config/app-config";
import { IAppContract } from "@/src/contract-types/AppContract";
import { appInterface, auctionInterface, BATCH_MESSAGE_TYPE, BUY_EXCHANGE_RATE_BPS, BUY_NOW_PRICE, cw20Interface, cw721Interface, exchangeInterface, MIN_BID, MIN_RAISE, NATIVE, REDEEM_EXCHANGE_RATE_BPS, SHARES_SUPPLY, splitterInterface } from "./types";
import { AssetLib, IExchangeContract, ScheduleLib } from "@/src/contract-types/ExchangeContract";
import type { IKernelContract, AmpMsgLib } from "@/src/contract-types/KernelContract";
import { ICw20Contract } from "@/src/contract-types/Cw20Contract";
import type { RecipientLib, SplitterContractStorage } from "@/src/contract-types/SplitterContract";
import { IAuctionContract } from "@/src/contract-types/AuctionContract";



export interface BatchMessageBuilderProps {
    owner: string;
    tokenId: string;
    tokenUri: string;
}


export const createBatchMessageBuilder = ({ owner, tokenId,tokenUri }: BatchMessageBuilderProps) => {
    const abiCoder = AbiCoder.defaultAbiCoder();

    // Batch Execute ADO Params Struct needed for the batch execute message
    const batchExecuteAdoParamsStruct = getStructAbi(KernelContract__factory.abi, "struct IKernelContract.BatchExecuteAdoParams");
    if (!batchExecuteAdoParamsStruct) {
        throw new Error("BatchExecuteAdoParams struct not found");
    }

    // Function to create add app component execute message
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


    // STEP1 - MINTING THE TOKEN USING ERC721
    const mintTokenMessage: IKernelContract.BatchExecuteAdoParamsStruct = {
        amp_msg: {
            recipient: APP_CONFIG.token_address(),
            message: cw721Interface.encodeFunctionData("mint_with_uri", [owner, tokenId, tokenUri]),
            funds: BigInt(0),
            config: { exit_at_error: true },
        } as AmpMsgLib.AmpMsgStruct
    }

    const encodedMintMessage: IKernelContract.BatchMessageStruct = {
        message_type: BATCH_MESSAGE_TYPE.EXECUTE_ADO,
        data: abiCoder.encode([batchExecuteAdoParamsStruct], [mintTokenMessage])
    }


    const setupShares = (): IKernelContract.BatchMessageStruct => {
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
        return sharesMessage;
    }


    // STEP3 - SETUP BUY Exchange 
    const setUpBuyExchange = ( buyDuration: string): IKernelContract.BatchMessageStruct => {
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
            from_asset: { native: NATIVE, smart: "" } as AssetLib.AssetStruct,
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

    // STEP4- Setup REDEEM exchange
    const setUpRedeemExchange = ( redeemStartTime: string): IKernelContract.BatchMessageStruct => {
        const redeemContractMessage: IExchangeContract.ExchangeContractInitParamsStruct = {
            owner: owner,
            from_asset: {
                native: "",
                smart: APP_CONFIG.shares_address(Number(tokenId))
            } as AssetLib.AssetStruct,
            to_asset: { native: NATIVE, smart: "" } as AssetLib.AssetStruct,
            recipient: {
                recipient: owner,
                message: "0x"
            } as RecipientLib.RecipientStruct,
            exchange_rate_bps: REDEEM_EXCHANGE_RATE_BPS,
            schedule: {
                start: {
                    from_now: redeemStartTime,
                    at_time: 0,
                    infinite: false
                } as ScheduleLib.ExpiryStruct,
                end: {
                    from_now: 0,
                    at_time: 0,
                    infinite: true
                } as ScheduleLib.ExpiryStruct,
            } as ScheduleLib.ScheduleStruct
        }

        const encodedRedeemContractMessage = exchangeInterface.encodeFunctionData("initialize", [redeemContractMessage])

        const message = createAddAppComponentExecuteMessage(`redeem-shares-${tokenId}`, "exchange@0.1.0", encodedRedeemContractMessage)
        return message
    }

    // STEP5- SEND/APPROVE Shares to BuyExchange
    const approveSharesToExchange = (): IKernelContract.BatchMessageStruct => {
        const kernelContractBatchMessage: IKernelContract.BatchExecuteAdoParamsStruct = {
            amp_msg: {
                recipient: (APP_CONFIG.shares_address(Number(tokenId))),
                message: cw20Interface.encodeFunctionData("approve(string,uint256)", [APP_CONFIG.buy_exchange_address(Number(tokenId)), SHARES_SUPPLY]),
                funds: 0,
                config: {
                    exit_at_error: true
                }
            } as AmpMsgLib.AmpMsgStruct,
        }

        const encodedBatchExecuteMessage = abiCoder.encode([batchExecuteAdoParamsStruct], [kernelContractBatchMessage])
        const message: IKernelContract.BatchMessageStruct = {
            message_type: BATCH_MESSAGE_TYPE.EXECUTE_ADO,
            data: encodedBatchExecuteMessage
        }

        return message
    }

    // STEP6- START exchange
    const startExchange = (): IKernelContract.BatchMessageStruct => {
        const kernelContractBatchMessage: IKernelContract.BatchExecuteAdoParamsStruct = {
            amp_msg: {
                recipient: APP_CONFIG.buy_exchange_address(Number(tokenId)),
                message: exchangeInterface.encodeFunctionData("add_funds_erc20", [SHARES_SUPPLY]),
                funds: 0,
                config: { exit_at_error: true },
            } as AmpMsgLib.AmpMsgStruct
        }
        const encodedBatchExecuteMessage = abiCoder.encode([batchExecuteAdoParamsStruct], [kernelContractBatchMessage])
        const message: IKernelContract.BatchMessageStruct = {
            message_type: BATCH_MESSAGE_TYPE.EXECUTE_ADO,
            data: encodedBatchExecuteMessage
        }

        return message
    }

    // STEP7- SEND/Approve NFT to Auction
    const approveNftToAuction = (): IKernelContract.BatchMessageStruct => {
        const kernelContractBatchMessage: IKernelContract.BatchExecuteAdoParamsStruct = {
            amp_msg: {
                recipient: APP_CONFIG.token_address(),
                message: cw721Interface.encodeFunctionData("approve(string,uint256)", [APP_CONFIG.auction_address(), tokenId]),
                funds: 0,
                config: {
                    exit_at_error: true
                }
            } as AmpMsgLib.AmpMsgStruct
        }
        const encodedBatchExecuteMessage = abiCoder.encode([batchExecuteAdoParamsStruct], [kernelContractBatchMessage])
        const message: IKernelContract.BatchMessageStruct = {
            message_type: BATCH_MESSAGE_TYPE.EXECUTE_ADO,
            data: encodedBatchExecuteMessage
        }

        return message
    }

    // STEP8- START AUCTION
    const startAuction = ( auctionStartTime: string, auctionDuration: string): IKernelContract.BatchMessageStruct => {
        const rate: IExchangeContract.DynamicExchangeRateStruct = {
            max_inflow_amount: SHARES_SUPPLY,
        }
        const config: SplitterContractStorage.SplitterConfigStruct[] = [
            {
                recipient: {
                    recipient: owner,
                    message: "0x"
                } as RecipientLib.RecipientStruct,
                split_bps: 500
            },
            {
                recipient: {
                    recipient: APP_CONFIG.redeem_exchange_address(Number(tokenId)),
                    message: exchangeInterface.encodeFunctionData("add_funds_native_dynamic", [rate]),
                } as RecipientLib.RecipientStruct,
                split_bps: 9500
            }
        ]
        const encodedSplitterMessage = splitterInterface.encodeFunctionData("send_native", [config])
        const auctionContractMessage: IAuctionContract.StartAuctionParamsStruct = {
            token_id: Number(tokenId),
            min_bid: MIN_BID,
            min_raise: MIN_RAISE,
            schedule: {
                start: {
                    from_now: auctionStartTime,
                    at_time: 0,
                    infinite: false
                } as ScheduleLib.ExpiryStruct,
                end: {
                    from_now: auctionDuration,
                    at_time: 0,
                    infinite: false
                } as ScheduleLib.ExpiryStruct,
            } as ScheduleLib.ScheduleStruct,
            recipient: {
                recipient: APP_CONFIG.splitter_address(),
                message: encodedSplitterMessage
            } as RecipientLib.RecipientStruct,
            bid_asset: {
                native: NATIVE,
                smart: ""
            } as AssetLib.AssetStruct,
            buy_now_price: BUY_NOW_PRICE,
        }
        const kernelContractBatchMessage: IKernelContract.BatchExecuteAdoParamsStruct = {
            amp_msg: {
                recipient: APP_CONFIG.auction_address(),
                message: auctionInterface.encodeFunctionData("start_auction", [auctionContractMessage]),
                funds: 0,
                config: { exit_at_error: true },
            } as AmpMsgLib.AmpMsgStruct
        }
        const encodedAddAppComponentMessage = abiCoder.encode([batchExecuteAdoParamsStruct], [kernelContractBatchMessage])
        const message: IKernelContract.BatchMessageStruct = {
            message_type: BATCH_MESSAGE_TYPE.EXECUTE_ADO,
            data: encodedAddAppComponentMessage
        }

        return message;
    }

    return{
        encodedMintMessage,
        setupShares,
        setUpBuyExchange,
        setUpRedeemExchange,
        approveSharesToExchange,
        startExchange,
        approveNftToAuction,
        startAuction,
    }


}