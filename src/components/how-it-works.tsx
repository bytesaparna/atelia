"use client"
import { motion } from "framer-motion"
import { Upload, Palette, ShoppingCart, TrendingUp } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      icon: Upload,
      title: "Create & Upload Your Design",
      description: "Upload your digital artwork and mint it as an NFT on the blockchain. Set your price.",
      step: "01",
    },
    {
      icon: Palette,
      title: "Showcase Your Art on Exchange",
      description: "Your NFT appears in our exchange platform where collectors can discover and appreciate your work by buying the shares.",
      step: "02",
    },
    {
      icon: ShoppingCart,
      title: "Buy & Sell of Shares",
      description: "Purchase NFTs with cryptocurrency or sell shares of your collection to other enthusiasts worldwide on the exchage platform.",
      step: "03",
    },
    {
      icon: TrendingUp,
      title: "Auction",
      description: "Auctions connect your creations with major brands. Winning bids not only reward you financially but also bring recognition, prestige, and stronger brand value.",
      step: "04",
    },
  ]

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-background to-slate-900/20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-balance">
            How It{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Works</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto text-pretty">
            Join the digital art revolution in four simple steps. Create, showcase, trade, and earn from your digital
            masterpieces.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 h-full hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {step.step}
                </div>
                <div className="mb-6 p-3 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 rounded-xl w-fit">
                  <step.icon className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{step.title}</h3>
                <p className="text-slate-300 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
