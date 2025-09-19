import { HeroParallax } from "@/src/components/hero-parallax"
import { getNftCollections } from "../lib/app-utils";

export async function NFTMarketplaceHero() {
  const nftCollections = await getNftCollections();
  return <HeroParallax products={nftCollections} />
}