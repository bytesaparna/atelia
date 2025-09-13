"use client"
import { HeroParallax } from "@/components/ui/hero-parallax"

export function NFTMarketplaceHero() {
  return <HeroParallax products={nftCollections} />
}

export const nftCollections = [
  {
    title: "Cosmic Dreamscapes",
    link: "#",
    thumbnail: "/cosmic-digital-art-with-nebula-and-stars.jpg",
    price: "2.5 ETH",
    creator: "AstroArtist",
  },
  {
    title: "Neon Cityscapes",
    link: "#",
    thumbnail: "/cyberpunk-neon-city.png",
    price: "1.8 ETH",
    creator: "CyberVision",
  },
  {
    title: "Abstract Geometrics",
    link: "#",
    thumbnail: "/abstract-geometric-digital-art-colorful.jpg",
    price: "3.2 ETH",
    creator: "GeometryMaster",
  },
  {
    title: "Digital Portraits",
    link: "#",
    thumbnail: "/futuristic-digital-portrait-art.jpg",
    price: "4.1 ETH",
    creator: "PortraitPro",
  },
  {
    title: "Fractal Dimensions",
    link: "#",
    thumbnail: "/fractal-mathematical-digital-art.jpg",
    price: "2.9 ETH",
    creator: "FractalMind",
  },
  {
    title: "Ethereal Landscapes",
    link: "#",
    thumbnail: "/ethereal-fantasy-landscape-digital-art.jpg",
    price: "3.7 ETH",
    creator: "DreamWeaver",
  },
  {
    title: "Pixel Legends",
    link: "#",
    thumbnail: "/pixel-art-character-retro-gaming.jpg",
    price: "1.5 ETH",
    creator: "PixelMaster",
  },
  {
    title: "Quantum Realms",
    link: "#",
    thumbnail: "/quantum-art.png",
    price: "5.2 ETH",
    creator: "QuantumArt",
  },
  {
    title: "Bio-Mechanical",
    link: "#",
    thumbnail: "/biomechanical-cyborg-digital-art.jpg",
    price: "2.3 ETH",
    creator: "BioTech",
  },
  {
    title: "Crystal Formations",
    link: "#",
    thumbnail: "/crystal-formation-mineral-digital-art.jpg",
    price: "1.9 ETH",
    creator: "CrystalVision",
  },
  {
    title: "Holographic Dreams",
    link: "#",
    thumbnail: "/holographic-iridescent-digital-art.jpg",
    price: "4.8 ETH",
    creator: "HoloArtist",
  },
  {
    title: "Neural Networks",
    link: "#",
    thumbnail: "/neural-network-ai-inspired-digital-art.jpg",
    price: "3.4 ETH",
    creator: "AICreator",
  },
  {
    title: "Void Walkers",
    link: "#",
    thumbnail: "/dark-void-space-walker-digital-art.jpg",
    price: "6.1 ETH",
    creator: "VoidMaster",
  },
  {
    title: "Chromatic Waves",
    link: "#",
    thumbnail: "/chromatic-wave-pattern-digital-art.jpg",
    price: "2.7 ETH",
    creator: "WaveForm",
  },
  {
    title: "Digital Mythology",
    link: "#",
    thumbnail: "/digital-mythology-gods-fantasy-art.jpg",
    price: "7.3 ETH",
    creator: "MythMaker",
  },
]
