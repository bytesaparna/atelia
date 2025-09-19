interface AppConfigItem {
    name: string,
    tokens_address: string,
    shares_address: string,
    auction_address: string,
    buy_exchange_address: string
    redeem_exchange_address: string
}

export const APP_CONFIG: AppConfigItem[] = [
    {
        name: "somnia-hack-design-one",
        tokens_address: `/home/${process.env.NEXT_PUBLIC_OWNER_ADDRESS}/somnia-hack-design-one/tokens`,
        shares_address: `/home/${process.env.NEXT_PUBLIC_OWNER_ADDRESS}/somnia-hack-design-one/shares`,
        auction_address: `/home/${process.env.NEXT_PUBLIC_OWNER_ADDRESS}/somnia-hack-design-one/auction`,
        buy_exchange_address: `/home/${process.env.NEXT_PUBLIC_OWNER_ADDRESS}/somnia-hack-design-one/buy-shares`,
        redeem_exchange_address: `/home/${process.env.NEXT_PUBLIC_OWNER_ADDRESS}/somnia-hack-design-one/redeem-shares`,
    },
    {
        name: "somnia-hack-design-two",
        tokens_address: `/home/${process.env.NEXT_PUBLIC_OWNER_ADDRESS}/somnia-hack-design-two/tokens`,
        shares_address: `/home/${process.env.NEXT_PUBLIC_OWNER_ADDRESS}/somnia-hack-design-two/shares`,
        auction_address: `/home/${process.env.NEXT_PUBLIC_OWNER_ADDRESS}/somnia-hack-design-two/auction`,
        buy_exchange_address: `/home/${process.env.NEXT_PUBLIC_OWNER_ADDRESS}/somnia-hack-design-two/buy-shares`,
        redeem_exchange_address: `/home/${process.env.NEXT_PUBLIC_OWNER_ADDRESS}/somnia-hack-design-two/redeem-shares`,
    },
    {
        name: "somnia-hack-design-three",
        tokens_address: `/home/${process.env.NEXT_PUBLIC_OWNER_ADDRESS}/somnia-hack-design-three/tokens`,
        shares_address: `/home/${process.env.NEXT_PUBLIC_OWNER_ADDRESS}/somnia-hack-design-three/shares`,
        auction_address: `/home/${process.env.NEXT_PUBLIC_OWNER_ADDRESS}/somnia-hack-design-three/auction`,
        buy_exchange_address: `/home/${process.env.NEXT_PUBLIC_OWNER_ADDRESS}/somnia-hack-design-three/buy-shares`,
        redeem_exchange_address: `/home/${process.env.NEXT_PUBLIC_OWNER_ADDRESS}/somnia-hack-design-three/redeem-shares`,
    },
    {
        name: "somnia-hack-design-four",
        tokens_address: `/home/${process.env.NEXT_PUBLIC_OWNER_ADDRESS}/somnia-hack-design-four/tokens`,
        shares_address: `/home/${process.env.NEXT_PUBLIC_OWNER_ADDRESS}/somnia-hack-design-four/shares`,
        auction_address: `/home/${process.env.NEXT_PUBLIC_OWNER_ADDRESS}/somnia-hack-design-four/auction`,
        buy_exchange_address: `/home/${process.env.NEXT_PUBLIC_OWNER_ADDRESS}/somnia-hack-design-four/buy-shares`,
        redeem_exchange_address: `/home/${process.env.NEXT_PUBLIC_OWNER_ADDRESS}/somnia-hack-design-four/redeem-shares`,
    },
    {
        name: "somnia-hack-design-five",
        tokens_address: `/home/${process.env.NEXT_PUBLIC_OWNER_ADDRESS}/somnia-hack-design-five/tokens`,
        shares_address: `/home/${process.env.NEXT_PUBLIC_OWNER_ADDRESS}/somnia-hack-design-five/shares`,
        auction_address: `/home/${process.env.NEXT_PUBLIC_OWNER_ADDRESS}/somnia-hack-design-five/auction`,
        buy_exchange_address: `/home/${process.env.NEXT_PUBLIC_OWNER_ADDRESS}/somnia-hack-design-five/buy-shares`,
        redeem_exchange_address: `/home/${process.env.NEXT_PUBLIC_OWNER_ADDRESS}/somnia-hack-design-five/redeem-shares`,
    },
    {
        name: "somnia-hack-design-six",
        tokens_address: `/home/${process.env.NEXT_PUBLIC_OWNER_ADDRESS}/somnia-hack-design-six/tokens`,
        shares_address: `/home/${process.env.NEXT_PUBLIC_OWNER_ADDRESS}/somnia-hack-design-six/shares`,
        auction_address: `/home/${process.env.NEXT_PUBLIC_OWNER_ADDRESS}/somnia-hack-design-six/auction`,
        buy_exchange_address: `/home/${process.env.NEXT_PUBLIC_OWNER_ADDRESS}/somnia-hack-design-six/buy-shares`,
        redeem_exchange_address: `/home/${process.env.NEXT_PUBLIC_OWNER_ADDRESS}/somnia-hack-design-six/redeem-shares`,
    },
    {
        name: "somnia-hack-design-seven",
        tokens_address: `/home/${process.env.NEXT_PUBLIC_OWNER_ADDRESS}/somnia-hack-design-seven/tokens`,
        shares_address: `/home/${process.env.NEXT_PUBLIC_OWNER_ADDRESS}/somnia-hack-design-seven/shares`,
        auction_address: `/home/${process.env.NEXT_PUBLIC_OWNER_ADDRESS}/somnia-hack-design-seven/auction`,
        buy_exchange_address: `/home/${process.env.NEXT_PUBLIC_OWNER_ADDRESS}/somnia-hack-design-seven/buy-shares`,
        redeem_exchange_address: `/home/${process.env.NEXT_PUBLIC_OWNER_ADDRESS}/somnia-hack-design-seven/redeem-shares`,
    },
]

