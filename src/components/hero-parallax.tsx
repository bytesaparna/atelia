"use client"
import React from "react"
import { motion, useScroll, useTransform, useSpring, type MotionValue } from "motion/react"
import { Button } from "@/src/components/ui/button"
import { cn } from "@/src/lib/utils"
import { useRouter } from "next/navigation"

export const HeroParallax = ({
  products,
}: {
  products: {
    title: string
    link: string
    thumbnail: string
    price?: string
    creator?: string
  }[]
}) => {
  const firstRow = products.slice(0, 5)
  const secondRow = products.slice(5, 10)
  const thirdRow = products.slice(10, 15)
  const ref = React.useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 }

  const translateX = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1000]), springConfig)
  const translateXReverse = useSpring(useTransform(scrollYProgress, [0, 1], [0, -1000]), springConfig)
  const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.2], [15, 0]), springConfig)
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.2], [0.2, 1]), springConfig)
  const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.2], [20, 0]), springConfig)
  const translateY = useSpring(useTransform(scrollYProgress, [0, 0.2], [-700, 500]), springConfig)
  return (
    <div
      ref={ref}
      className="h-[300vh] py-40 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className=""
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
          {firstRow.map((product) => (
            <NFTCard product={product} translate={translateX} />
          ))}
        </motion.div>
        <motion.div className="flex flex-row mb-20 space-x-20">
          {secondRow.map((product) => (
            <NFTCard product={product} translate={translateXReverse} />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
          {thirdRow.map((product) => (
            <NFTCard product={product} translate={translateX} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}

export const Header = () => {
  const router = useRouter()
  const handleExplore = () => {
    router.push('/explore')
  }
  const handleCreateNFT = () => {
    router.push('/create')
  }
  return (
    <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full left-0 top-0">
      <h1 className="text-2xl md:text-7xl font-bold text-foreground text-balance">
        Discover Rare <br />
        <span className="text-primary">Digital Assets</span>
      </h1>
      <p className="max-w-2xl text-base md:text-xl mt-8 text-muted-foreground text-pretty">
        Explore the world's largest NFT marketplace. Buy, sell, and discover exclusive digital collectibles from top
        artists and creators worldwide.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Button size="lg" className=" bg-primary hover:bg-primary/90 text-primary-foreground opacity-60 z-50" onClick={handleExplore}>
          Explore Collections
        </Button>
        <Button size="lg" variant="outline" className=" !border-white/20 border-1 text-foreground hover:bg-accent !bg-transparent opacity-60 z-50" onClick={handleCreateNFT}>
          Create NFT
        </Button>
      </div>
    </div>
  )
}

export const NFTCard = ({
  product,
  translate,
}: {
  product: {
    title: string
    link: string
    thumbnail: string
    price?: string
    creator?: string
  }
  translate: MotionValue<number>
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={product.title}
      className="group/product h-96 w-[30rem] relative shrink-0"
    >
      <div
        className={cn(
          "cursor-pointer overflow-hidden relative card h-full w-full rounded-xl shadow-xl backgroundImage flex flex-col justify-between p-6",
          "bg-cover bg-center transition-all duration-300 group-hover/product:shadow-2xl group-hover/product:scale-[1.02]",
        )}
        style={{
          backgroundImage: `url(${product.thumbnail || "/placeholder.svg"})`,
        }}
      >
        {product.creator && (
          <div className="flex flex-row items-center space-x-3 z-10 opacity-0 group-hover/product:opacity-100 transition-opacity duration-300">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">{product.creator.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex flex-col">
              <p className="font-medium text-base text-white relative z-10">{product.creator}</p>
              <p className="text-sm text-gray-300">Creator</p>
            </div>
          </div>
        )}

        <div className="text-content z-10">
          <h1 className="font-bold text-xl md:text-2xl text-white relative z-10 mb-2 group-hover/product:text-cyan-100 transition-colors">
            {product.title}
          </h1>

          {product.price && (
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-gray-300 text-sm">Current Price</span>
                <span className="text-cyan-400 font-bold text-xl">{product.price}</span>
              </div>
              <Button
                size="sm"
                className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white border-0 shadow-lg opacity-0 group-hover/product:opacity-100 transition-all duration-300 transform translate-y-2 group-hover/product:translate-y-0"
              >
                Buy Now
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
