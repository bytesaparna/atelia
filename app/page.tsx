import { NFTMarketplaceHero } from "@/src/components/nft-marketplace-hero"
import { HowItWorks } from "@/src/components/how-it-works"
import { Features } from "@/src/components/features"
import { Stats } from "@/src/components/stats"
import { Footer } from "@/src/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <NFTMarketplaceHero />
      <HowItWorks />
      <Features />
      <Stats />
      <Footer />
    </main>
  )
}
