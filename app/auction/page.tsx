import AuctionPage from "@/src/components/auction-page"
import { queryNftCollections } from "@/src/server/api/collections/queries"
import { RPC_PROVIDER } from "@/src/lib/evm-helper"
import { TokenState } from "@/src/types/collections"

export default async function Auction() {
    const nftCollections = await queryNftCollections(RPC_PROVIDER);
    const filteredNftCollections = nftCollections.filter(nft => nft.appStatus.state === TokenState.AUCTION);
    return <AuctionPage nftCollection={filteredNftCollections} />
}
