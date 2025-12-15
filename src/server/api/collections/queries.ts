import { APP_CONFIG } from "@/src/config/app-config";
import { getCurrentTimeInMilliseconds, getSharesContract, getTokensContract, RPC_PROVIDER } from "@/src/lib/evm-helper";
import { ITokenState, NftCollection, TokenState, TokenUri } from "@/src/types/collections";
import { ethers } from "ethers";
import { unstable_cache } from "next/cache";
import { queryResolvePath } from "../vfs/queries";
import { queryBuyExchangeConfig } from "../exchange/queries";
import { queryLatestAuctionState } from "../auction/queries";



export const queryTokenUri = (token_id: number) => unstable_cache(async (provider = RPC_PROVIDER) => {
    const tokens_address = await queryResolvePath(APP_CONFIG.token_address())();
    const contract = await getTokensContract(tokens_address, provider);
    const token = await contract.read.tokenURI([BigInt(token_id)]);
    return token
}, ["token_uri", token_id.toString()], {
    revalidate: 60 * 60 * 24, // 24 hrs
})


export const queryTokensSupply = unstable_cache(async (provider = RPC_PROVIDER) => {
    const tokens_address = await queryResolvePath(APP_CONFIG.token_address())();
    const contract = await getTokensContract(tokens_address, provider);
    const num_tokens = await contract.read.totalSupply();
    return Number(num_tokens)
}, ["tokens_supply"], {
    revalidate: 60 * 5, // 5 minutes
})


export const queryTokenByIndex = (index: number) => unstable_cache(async (provider = RPC_PROVIDER) => {
    const tokens_address = await queryResolvePath(APP_CONFIG.token_address())();
    const contract = await getTokensContract(tokens_address, provider);
    const token = await contract.read.tokenByIndex([BigInt(index)]);
    return Number(token)
}, ["token_by_index", index.toString()], {
    revalidate: 60 * 60 * 24, // 24 hrs
})


export const queryAllTokens = unstable_cache(async (provider = RPC_PROVIDER) => {
    const num_tokens = await queryTokensSupply(provider);
    const items = new Array(Number(num_tokens)).fill(0).map(async (_, i) => {
        const token = await queryTokenByIndex(i)(provider);
        return Number(token);
    });
    const tokens = await Promise.all(items);
    return tokens
}, ["all_tokens"], {
    revalidate: 60 * 5, // 5 minutes
})


export const queryNftCollections = unstable_cache(async (provider = RPC_PROVIDER) => {
    const tokens = await queryAllTokens(provider);
    const collections = await Promise.all(tokens.map(async (token_id) => {
        const nftCollection = await queryNftCollection(token_id, provider)();
        return nftCollection;
    }));
    return collections.filter((collection): collection is NonNullable<typeof collection> => collection !== null) as NftCollection[];
}, ["collections"], {
    revalidate: 60 * 5, // 5 minutes
})

export const queryNftCollection = (token_id: number, provider = RPC_PROVIDER) => unstable_cache(async () => {
    const tokens_address = await queryResolvePath(APP_CONFIG.token_address())();
    const tokenUri = await queryTokenUri(token_id)(provider).catch(() => null);
    if (!tokenUri) return null;
    const tokenUriData = await fechTokenUri(tokenUri);
    if (!tokenUriData) return null;
    const nftCollection = convertTokenUriToNftCollection(tokenUriData);
    const appStatus = await queryTokenState(token_id, provider)();
    return {
        contract_address: tokens_address,
        id: token_id,
        ...nftCollection,
        appStatus: appStatus,
    } satisfies NftCollection;
}, ["collection", "token_id", token_id.toString()], {
    revalidate: 60 * 5, // 5 minutes
})

export const convertTokenUriToNftCollection = (tokenUri: TokenUri) => {
    return {
        title: tokenUri.name,
        description: tokenUri.description,
        link: tokenUri.image,
        thumbnail: tokenUri.image,
        image: tokenUri.image,
        creator: tokenUri.attributes.find(attribute => attribute.trait_type === "designer")?.value || "atelia",
        likes: Number(tokenUri.attributes.find(attribute => attribute.trait_type === "likes")?.value) || (30 + Math.floor(Math.random() * 100)),
        views: Number(tokenUri.attributes.find(attribute => attribute.trait_type === "views")?.value) || (60 + Math.floor(Math.random() * 100)),
        category: tokenUri.attributes.find(attribute => attribute.trait_type === "category")?.value || "dress",
        verified: tokenUri.attributes.find(attribute => attribute.trait_type === "verified")?.value === "true",

        attributes: tokenUri.attributes,
    }
}


export const queryTokenState = (token_id: number, provider = RPC_PROVIDER) => unstable_cache(async () => {
    const exchangeConfig = await queryBuyExchangeConfig(token_id, provider)().catch(() => null);
    const auctionStatus = await queryLatestAuctionState(token_id, provider)().catch(() => null);
    const redeem_address = await queryResolvePath(APP_CONFIG.redeem_exchange_address(token_id))().catch(() => null);

    const currentTimeInMilliseconds = getCurrentTimeInMilliseconds();

    const min_bid_price = auctionStatus?.min_bid ?? 0;
    const min_raise_price = auctionStatus?.min_raise ?? 0;
    const share_buy_price = exchangeConfig ? 10000 / exchangeConfig.exchange_rate_bps : 0;

    const total_shares = exchangeConfig ? exchangeConfig.amount + exchangeConfig.exchanged_amount : 0;

    const price_based_on_buy = share_buy_price * total_shares;

    const token_state: TokenState = exchangeConfig ? Number(exchangeConfig.end_time) > currentTimeInMilliseconds ? TokenState.BUY : auctionStatus ? Number(auctionStatus.end_time) > currentTimeInMilliseconds ? TokenState.AUCTION : TokenState.REDEEM : TokenState.REDEEM : TokenState.BUY;

    const state: ITokenState = {
        state: token_state,
        auction_address: auctionStatus?.auction_address ?? "",
        buy_exchange_address: exchangeConfig?.contract_address ?? "",
        redeem_exchange_address: redeem_address ?? "",
        share_buy_price: share_buy_price,
        price_based_on_buy: price_based_on_buy,
        min_bid_price: min_bid_price,
        min_raise_price: min_raise_price,
        buy_end_time: exchangeConfig ? Number(exchangeConfig.end_time) : 0,
        auction_start_time: auctionStatus ? Number(auctionStatus.start_time) : 0,
        auction_end_time: auctionStatus ? Number(auctionStatus.end_time) : 0,
        redeem_start_time: exchangeConfig ? Number(exchangeConfig.start_time) : 0,
        latest_auction_id: auctionStatus ? auctionStatus.latest_auction_id : 0,
    }
    return state;
}, ["token", "state", "token_id", token_id.toString()], {
    revalidate: 60 * 5, // 5 minutes
})



export const fechTokenUri = unstable_cache(async (uri: string): Promise<TokenUri | null> => {
    try {
        if (!uri.startsWith('https://')) {
            uri = `https://atelia.vercel.app/tokens${uri}.json`
        }
        console.log(`Fetching token URI: ${uri}`);
        const tokenUri = await fetch(uri);
        if (!tokenUri.ok) {
            console.log(`Failed to fetch token URI: ${uri}, status: ${tokenUri.status}`);
            return null;
        }
        return await tokenUri.json() as TokenUri;
    } catch (error) {
        return null;
    }
}, ["uri"], {
    revalidate: 60 * 60 * 24, // 24 hours
})


// given and nft id and user address, return the user's share balance of the nft
const queryUserShareBalanceOfNft = unstable_cache(async (token_id: number, userAddress: string, provider = RPC_PROVIDER) => {
    const shares_address = await queryResolvePath(APP_CONFIG.shares_address(token_id))()
    const shares_contract = await getSharesContract(shares_address, provider)
    const balance = await shares_contract.read.balanceOf([userAddress as `0x${string}`])
    return Number(balance)
}, ["user_share_balance"], {
    revalidate: 60 * 5, // 5min
})

// given a user address, return the user's share balance of all nfts
export const queryUserShareBalanceOfAllNfts = unstable_cache(async (userAddress: string, provider = RPC_PROVIDER) => {
    const tokens = await queryAllTokens(provider)
    const balances = await Promise.all(tokens.map(async (token_id) => {
        const balance = await queryUserShareBalanceOfNft(token_id, userAddress, provider)
        if (balance === 0) return null
        return {
            token_id,
            balance,
            token: await queryNftCollection(token_id, provider)()
        }
    }))
    // Filter out null values (NFTs with 0 balance)
    const filteredBalances = balances.filter((item): item is NonNullable<typeof item> => item !== null)
    return filteredBalances
}, ["user_share_balances_all"], {
    revalidate: 60 * 5,
})