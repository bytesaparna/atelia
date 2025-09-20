"use client"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function Stats() {
  const [counts, setCounts] = useState({
    artworks: 0,
    artists: 0,
    sales: 0,
    volume: 0,
  })

  const finalStats = {
    artworks: 50000,
    artists: 12000,
    sales: 180000,
    volume: 2500,
  }

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const stepDuration = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps

      setCounts({
        artworks: Math.floor(finalStats.artworks * progress),
        artists: Math.floor(finalStats.artists * progress),
        sales: Math.floor(finalStats.sales * progress),
        volume: Math.floor(finalStats.volume * progress),
      })

      if (step >= steps) {
        clearInterval(timer)
        setCounts(finalStats)
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [])

  const stats = [
    {
      label: "Digital Artworks",
      value: counts.artworks.toLocaleString(),
      suffix: "+",
    },
    {
      label: "Active Artists",
      value: counts.artists.toLocaleString(),
      suffix: "+",
    },
    {
      label: "Total Sales",
      value: counts.sales.toLocaleString(),
      suffix: "+",
    },
    {
      label: "Trading Volume",
      value: counts.volume.toLocaleString(),
      suffix: "K STT",
    },
  ]

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-slate-900/30 to-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-balance">
            Trusted by{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
              Thousands
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto text-pretty">
            Join a thriving community of artists and collectors who have made our platform their home for digital art.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-slate-800/20 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-8 hover:border-cyan-500/30 transition-all duration-300">
                <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 mb-2">
                  {stat.value}
                  {stat.suffix}
                </div>
                <div className="text-slate-300 font-medium">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
