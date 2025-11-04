export const APP_CONFIG = {
    address: `~${process.env.NEXT_PUBLIC_OWNER_ADDRESS}/somnia-hack-atelia-3`,
    auction_address: () => `${APP_CONFIG.address}/auction`,
    token_address: () => `${APP_CONFIG.address}/tokens`,
    splitter_address: () => `${APP_CONFIG.address}/splitter`,
    shares_address: (token_id: number) => `${APP_CONFIG.address}/shares-${token_id}`,
    buy_exchange_address: (token_id: number) => `${APP_CONFIG.address}/buy-shares-${token_id}`,
    redeem_exchange_address: (token_id: number) => `${APP_CONFIG.address}/redeem-shares-${token_id}`,
}

export const TOKEN_DENOM = 'STT'