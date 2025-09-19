"use client"
import { HeroParallax } from "@/src/components/hero-parallax"

export function NFTMarketplaceHero() {
  return <HeroParallax products={nftCollections} />
}


export const nftCollections = [
  {
    title: "Midnight Elegance",
    link: "#",
    thumbnail: "/design-one.png",
    price: "$250",
    creator: "Atelia Couture",
  },
  {
    title: "Geometric Glam",
    link: "#",
    thumbnail: "/design-two.png",
    price: "$320",
    creator: "ModernMint",
  },
  {
    title: "Neon Nights",
    link: "#",
    thumbnail: "/design-three.png",
    price: "$180",
    creator: "CyberWear",
  },
  {
    title: "Regal Portraits",
    link: "#",
    thumbnail: "/design-four.png",
    price: "$410",
    creator: "Royal Threads",
  },
  {
    title: "Fractal Flow",
    link: "#",
    thumbnail: "/design-five.png",
    price: "$290",
    creator: "MathWear",
  },
  {
    title: "Sunset Horizons",
    link: "#",
    thumbnail: "/design-six.png",
    price: "$370",
    creator: "NatureTech",
  },
  {
    title: "Pixel Chic",
    link: "#",
    thumbnail: "/design-seven.png",
    price: "$150",
    creator: "PixelMode",
  },
  {
    title: "Quantum Couture",
    link: "#",
    thumbnail: "/design-one.png",
    price: "$520",
    creator: "QuantumStyle",
  },
  {
    title: "BioSilk Fusion",
    link: "#",
    thumbnail: "/design-two.png",
    price: "$230",
    creator: "BioFashion",
  },
  {
    title: "Crystal Elegance",
    link: "#",
    thumbnail: "/design-three.png",
    price: "$190",
    creator: "CrystalWear",
  },
  {
    title: "Hologram Luxe",
    link: "#",
    thumbnail: "/design-four.png",
    price: "$480",
    creator: "HoloCouture",
  },
]


