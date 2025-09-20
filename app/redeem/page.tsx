import ExploreNFTs from "@/src/components/explore-nfts"
import { RPC_PROVIDER } from "@/src/lib/evm-helper";
import { queryNftCollections } from "@/src/server/api/collections/queries";
import { TokenState } from "@/src/types/collections";

export default async function ExplorePage() {
  const nftCollections = await queryNftCollections(RPC_PROVIDER);
  const filteredNftCollections = nftCollections.filter(nft => nft.appStatus.state === TokenState.REDEEM);

  return (
    <main className="min-h-screen bg-background">
      <ExploreNFTs nftCollections={filteredNftCollections} isRedeem />
    </main>
  )
}
