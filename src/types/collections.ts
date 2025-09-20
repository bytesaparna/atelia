export interface NftCollection {
    contract_address: string;
    id: number;
    title: string;
    description: string;
    link: string;
    thumbnail: string;
    image: string;
    creator: string;

    likes: number;
    views: number;
    category: string;
    verified: boolean;

    attributes: TokenAttribute[];
    appStatus: ITokenState;
}

export interface TokenUri {
    name: string;
    description: string;
    image: string;
    attributes: TokenAttribute[];
}
export interface TokenAttribute {
    trait_type: string;
    value: string;
    rarity: string;
}


export enum TokenState {
    BUY = 'buy',
    AUCTION = 'auction',
    REDEEM = 'redeem',
}

export interface ITokenState {
    state: TokenState;
    auction_address: string;
    buy_exchange_address: string;
    redeem_exchange_address: string;
    share_buy_price: number;
    min_bid_price: number;
    min_raise_price: number;
    price_based_on_buy: number;
    buy_end_time: number;
    auction_start_time: number;
    auction_end_time: number;
    redeem_start_time: number;
}
