"use client"
import { HeroParallax } from "@/src/components/hero-parallax"

export function NFTMarketplaceHero() {
  return <HeroParallax products={nftCollections} />
}

export const nftCollections = [
  {
    title: "Cosmic Dreamscapes",
    link: "#",
    thumbnail: "/design-one.png",
    price: "2.5 ETH",
    creator: "AstroArtist",
  },
  {
    title: "Abstract Geometrics",
    link: "#",
    thumbnail: "/design-four.png",
    price: "3.2 ETH",
    creator: "GeometryMaster",
  },
  {
    title: "Neon Cityscapes",
    link: "#",
    thumbnail: "/design-three.png",
    price: "1.8 ETH",
    creator: "CyberVision",
  },
  {
    title: "Digital Portraits",
    link: "#",
    thumbnail: "/design-two.png",
    price: "4.1 ETH",
    creator: "PortraitPro",
  },
  {
    title: "Fractal Dimensions",
    link: "#",
    thumbnail: "/design-five.png",
    price: "2.9 ETH",
    creator: "FractalMind",
  },
  {
    title: "Ethereal Landscapes",
    link: "#",
    thumbnail: "/design-six.png",
    price: "3.7 ETH",
    creator: "DreamWeaver",
  },
  {
    title: "Pixel Legends",
    link: "#",
    thumbnail: "/design-seven.png",
    price: "1.5 ETH",
    creator: "PixelMaster",
  },
  {
    title: "Quantum Realms",
    link: "#",
    thumbnail: "/design-five.png",
    price: "5.2 ETH",
    creator: "QuantumArt",
  },
  {
    title: "Bio-Mechanical",
    link: "#",
    thumbnail: "/design-two.png",
    price: "2.3 ETH",
    creator: "BioTech",
  },
  {
    title: "Crystal Formations",
    link: "#",
    thumbnail: "/design-two.png",
    price: "1.9 ETH",
    creator: "CrystalVision",
  },
  {
    title: "Holographic Dreams",
    link: "#",
    thumbnail: "/design-five.png",
    price: "4.8 ETH",
    creator: "HoloArtist",
  },
  // {
  //   title: "Neural Networks",
  //   link: "#",
  //   thumbnail: "/design-six.png",
  //   price: "3.4 ETH",
  //   creator: "AICreator",
  // },
  // {
  //   title: "Void Walkers",
  //   link: "#",
  //   thumbnail: "/design-seven.png",
  //   price: "6.1 ETH",
  //   creator: "VoidMaster",
  // },
  // {
  //   title: "Chromatic Waves",
  //   link: "#",
  //   thumbnail: "/design-five.png",
  //   price: "2.7 ETH",
  //   creator: "WaveForm",
  // },
  // {
  //   title: "Digital Mythology",
  //   link: "#",
  //   thumbnail: "/design-five.png",
  //   price: "7.3 ETH",
  //   creator: "MythMaker",
  // },
]
