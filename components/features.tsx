"use client"
import { motion } from "framer-motion"
import { Shield, Zap, Globe, Users, Lock, Coins } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: Shield,
      title: "Secure Blockchain",
      description: "Built on Ethereum with smart contract security audits and decentralized storage.",
    },
    {
      icon: Zap,
      title: "Instant Trading",
      description: "Lightning-fast transactions with minimal gas fees and instant settlement.",
    },
    {
      icon: Globe,
      title: "Global Marketplace",
      description: "Connect with collectors and artists from around the world in our vibrant community.",
    },
    {
      icon: Users,
      title: "Creator Tools",
      description: "Advanced tools for artists including batch minting, collections, and analytics.",
    },
    {
      icon: Lock,
      title: "Wallet Integration",
      description: "Seamlessly connect with MetaMask, WalletConnect, and other popular wallets.",
    },
    {
      icon: Coins,
      title: "Multiple Currencies",
      description: "Trade with ETH, WETH, and other popular cryptocurrencies with real-time rates.",
    },
  ]

  return (
    <section className="py-24 px-4 bg-slate-900/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-balance">
            Why Choose{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
              Our Platform
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto text-pretty">
            Experience the future of digital art trading with cutting-edge technology and unmatched security.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-8 h-full hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 hover:bg-slate-800/50">
                <div className="mb-6 p-3 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-xl w-fit group-hover:from-emerald-500/20 group-hover:to-cyan-500/20 transition-all duration-300">
                  <feature.icon className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-slate-300 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
