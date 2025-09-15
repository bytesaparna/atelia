"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Separator } from "@/src/components/ui/separator"
import { Heart, Share2, Flag, Eye, TrendingUp, Clock, User, Zap } from "lucide-react"
import Link from "next/link"

// Mock NFT data - in a real app, this would come from an API
const mockNFTs = {
  "1": {
    id: "1",
    title: "Cosmic Dreams #001",
    description:
      "A mesmerizing journey through the cosmos, featuring swirling galaxies and nebulae in vibrant colors. This piece represents the infinite possibilities of digital art and the beauty of the universe.",
    image: "/cosmic-digital-art-with-nebula-and-stars.jpg",
    price: "2.5 ETH",
    creator: "ArtistX",
    owner: "Collector123",
    category: "Digital Art",
    likes: 1247,
    views: 8934,
    created: "2024-01-15",
    blockchain: "Ethereum",
    tokenId: "0x1a2b3c...",
    royalties: "10%",
    properties: [
      { trait: "Background", value: "Cosmic", rarity: "15%" },
      { trait: "Style", value: "Abstract", rarity: "25%" },
      { trait: "Colors", value: "Vibrant", rarity: "30%" },
    ],
    history: [
      { event: "Minted", price: "0.1 ETH", from: "", to: "ArtistX", date: "2024-01-15" },
      { event: "Sale", price: "1.2 ETH", from: "ArtistX", to: "Collector123", date: "2024-01-20" },
      { event: "Listed", price: "2.5 ETH", from: "Collector123", to: "", date: "2024-01-25" },
    ],
  },
  "2": {
    id: "2",
    title: "Neon City Nights",
    description:
      "A cyberpunk-inspired cityscape with neon lights reflecting off wet streets. This artwork captures the essence of a futuristic metropolis.",
    image: "/cyberpunk-neon-city.png",
    price: "1.8 ETH",
    creator: "CyberArt",
    owner: "TechCollector",
    category: "Cyberpunk",
    likes: 892,
    views: 5621,
    created: "2024-01-10",
    blockchain: "Ethereum",
    tokenId: "0x2b3c4d...",
    royalties: "7.5%",
    properties: [
      { trait: "Theme", value: "Cyberpunk", rarity: "20%" },
      { trait: "Lighting", value: "Neon", rarity: "18%" },
      { trait: "Mood", value: "Dark", rarity: "35%" },
    ],
    history: [
      { event: "Minted", price: "0.05 ETH", from: "", to: "CyberArt", date: "2024-01-10" },
      { event: "Sale", price: "0.8 ETH", from: "CyberArt", to: "TechCollector", date: "2024-01-12" },
      { event: "Listed", price: "1.8 ETH", from: "TechCollector", to: "", date: "2024-01-18" },
    ],
  },
}

export function NFTDetail({ id }: { id: string }) {
  const [isLiked, setIsLiked] = useState(false)
  const [activeTab, setActiveTab] = useState("details")

  // Get NFT data or fallback to first NFT
  const nft = mockNFTs[id as keyof typeof mockNFTs] || mockNFTs["1"]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* NFT Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl">
              <img src={nft.image || "/placeholder.svg"} alt={nft.title} className="w-full h-full object-cover" />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsLiked(!isLiked)}
                className={`flex items-center gap-2 ${isLiked ? "text-red-500 border-red-500" : ""}`}
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                {nft.likes + (isLiked ? 1 : 0)}
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                <Flag className="h-4 w-4" />
                Report
              </Button>
            </div>
          </motion.div>

          {/* NFT Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <Badge variant="secondary" className="mb-3">
                {nft.category}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{nft.title}</h1>
              <p className="text-muted-foreground text-lg leading-relaxed">{nft.description}</p>
            </div>

            {/* Creator & Owner Info */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Creator</p>
                      <p className="font-semibold">{nft.creator}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Owner</p>
                      <p className="font-semibold">{nft.owner}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                  <Eye className="h-4 w-4" />
                </div>
                <p className="text-2xl font-bold text-foreground">{nft.views.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Views</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                  <Heart className="h-4 w-4" />
                </div>
                <p className="text-2xl font-bold text-foreground">{nft.likes}</p>
                <p className="text-sm text-muted-foreground">Likes</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <p className="text-2xl font-bold text-foreground">#{Math.floor(Math.random() * 100) + 1}</p>
                <p className="text-sm text-muted-foreground">Rank</p>
              </div>
            </div>

            {/* Price & Purchase */}
            <Card className="border-2 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Current Price</p>
                    <p className="text-3xl font-bold text-primary">{nft.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">≈ $4,250 USD</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600">
                    <Zap className="h-4 w-4 mr-2" />
                    Buy Now
                  </Button>
                  <Link href="/auction" className="flex-1">
                    <Button variant="outline" className="w-full bg-transparent">
                      <Clock className="h-4 w-4 mr-2" />
                      Place Bid
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Tabs Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex gap-6 mb-6 border-b border-border">
            {["details", "properties", "history"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-1 text-sm font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "details" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Token ID</span>
                    <span className="font-mono text-sm">{nft.tokenId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Blockchain</span>
                    <span>{nft.blockchain}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created</span>
                    <span>{nft.created}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Royalties</span>
                    <span>{nft.royalties}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "properties" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {nft.properties.map((property, index) => (
                <Card key={index}>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">{property.trait}</p>
                    <p className="font-semibold mb-2">{property.value}</p>
                    <Badge variant="secondary" className="text-xs">
                      {property.rarity} have this trait
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === "history" && (
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {nft.history.map((transaction, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <TrendingUp className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{transaction.event}</p>
                            <p className="text-sm text-muted-foreground">
                              {transaction.from && `From ${transaction.from}`}
                              {transaction.to && ` To ${transaction.to}`}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{transaction.price}</p>
                          <p className="text-sm text-muted-foreground">{transaction.date}</p>
                        </div>
                      </div>
                      {index < nft.history.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  )
}
