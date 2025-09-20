export interface NftCollection {
    contract_address: string;
    id: number;
    title: string;
    description: string;
    link: string;
    thumbnail: string;
    image: string;
    price: number;
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
    share_redeem_price: number;
    latest_auction_price: number;
    min_bid_price: number;
    min_raise_price: number;
    current_price: number;
    price_based_on_buy: number;
    price_based_on_redeem: number;
    buy_end_time: number;
    auction_start_time: number;
    auction_end_time: number;
    redeem_start_time: number;
}
