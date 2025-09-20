import { HeroParallax } from "@/src/components/hero-parallax"
import { queryNftCollections } from "@/src/server/api/collections/queries";
import { RPC_PROVIDER } from "../lib/evm-helper";

export async function NFTMarketplaceHero() {
  const nftCollections = await queryNftCollections(RPC_PROVIDER);
  return <HeroParallax products={nftCollections} />
}