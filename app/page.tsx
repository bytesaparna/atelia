import { NFTMarketplaceHero } from "@/components/nft-marketplace-hero"
import { HowItWorks } from "@/components/how-it-works"
import { Features } from "@/components/features"
import { Stats } from "@/components/stats"
import { Footer } from "@/components/footer"

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
