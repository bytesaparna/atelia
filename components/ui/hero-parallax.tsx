"use client"
import React from "react"
import { motion, useScroll, useTransform, useSpring, type MotionValue } from "motion/react"
import { Button } from "@/components/ui/button"

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
            <NFTCard product={product} translate={translateX} key={product.title} />
          ))}
        </motion.div>
        <motion.div className="flex flex-row mb-20 space-x-20">
          {secondRow.map((product) => (
            <NFTCard product={product} translate={translateXReverse} key={product.title} />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
          {thirdRow.map((product) => (
            <NFTCard product={product} translate={translateX} key={product.title} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}

export const Header = () => {
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
        <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          Explore Collections
        </Button>
        <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-accent bg-transparent">
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
      <a href={product.link} className="block group-hover/product:shadow-2xl">
        <img
          src={product.thumbnail || "/placeholder.svg"}
          height="600"
          width="600"
          className="object-cover object-center absolute h-full w-full inset-0 rounded-lg"
          alt={product.title}
        />
      </a>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-90 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none rounded-lg transition-opacity duration-300"></div>
      <div className="absolute bottom-0 left-0 right-0 p-6 opacity-0 group-hover/product:opacity-100 transition-opacity duration-300">
        <h2 className="text-white font-semibold text-lg mb-2">{product.title}</h2>
        {product.creator && <p className="text-gray-300 text-sm mb-2">by {product.creator}</p>}
        {product.price && (
          <div className="flex items-center justify-between">
            <span className="text-primary font-bold text-lg">{product.price}</span>
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Buy Now
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
