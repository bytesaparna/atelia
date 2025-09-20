"use client"
import { motion } from "framer-motion"
import { Upload, Palette, ShoppingCart, TrendingUp } from "lucide-react"

export function HowItWorks() {

  const steps = [
    {
      icon: Upload,
      title: "Tokenize & Showcase Designs Globally",
      description: "Designers worldwide can mint their digital artworks as NFTs, instantly showcasing their talent on a secure blockchain. Once minted, these design tokens appear on our platform for collectors and investors, creating global visibility and market traction. This unique exposure allows designers to gain recognition and attract investment from enthusiasts who value exclusive, one-of-a-kind creations.",
      step: "01",
    },
    {
      icon: Palette,
      title: "Invest in Shares & Earn Returns",
      description: "Collectors can purchase shares of these digital designs during the exchange period. Proceeds are primarily allocated to the designer, while a small platform fee ensures sustainable growth. This creates a transparent ecosystem where designers are rewarded fairly, and investors have the opportunity to profit from high-demand creative assets.",
      step: "02",
    },
    {
      icon: ShoppingCart,
      title: "Auction for Premium Exposure",
      description: "After the share-buying period ends, designs enter an auction phase, attracting brands and high-profile buyers. This process elevates the designer’s profile, allows brands to secure exclusive designs, and ensures maximum profitability for all stakeholders. Investors benefit from auction premiums proportional to their shareholdings.",
      step: "03",
    },
    {
      icon: TrendingUp,
      title: "Redeem Profits & Track Success",
      description: "Shareholders can redeem profits earned from successful auctions, while designers connect directly with brands for collaboration and licensing opportunities. This creates a full-circle ecosystem where creativity is rewarded, investors profit, and designers gain global recognition and brand partnerships.",
      step: "04",
    },
  ];



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
        <div className="flex justify-between px-35">
          <div className="grid grid-rows-1 md:grid-rows-2 lg:grid-rows-4 gap-14 mt-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group max-w-lg"
              >
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {step.step}
                  </div>
                  <div className="mb-6 p-3 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 rounded-xl w-fit">
                    <step.icon className="w-8 h-8 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">{step.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="grid grid-rows-1 md:grid-rows-2 lg:grid-rows-4 gap-14">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group max-w-lg"
              >
                <div className="backdrop-blur-sm rounded-2xl p-8 h-full hover:border-cyan-500/50 transition-all duration-300 shadow-lg shadow-cyan-500/10">
                  <p className="text-slate-300 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
