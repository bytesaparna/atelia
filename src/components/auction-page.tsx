"use client"

import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { Badge } from "@/src/components/ui/badge"
import { Separator } from "@/src/components/ui/separator"
import { Clock, Gavel, TrendingUp, Zap, Heart, Eye, User } from "lucide-react"
import Link from "next/link"

// Mock auction data
const mockAuctions = [
  {
    id: "1",
    title: "Cosmic Dreams #001",
    description: "A mesmerizing journey through the cosmos, featuring swirling galaxies and nebulae.",
    image: "/cosmic-digital-art-with-nebula-and-stars.jpg",
    currentBid: "2.5 ETH",
    startingBid: "0.5 ETH",
    creator: "ArtistX",
    category: "Digital Art",
    likes: 1247,
    views: 8934,
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    bidHistory: [
      { bidder: "Collector123", amount: "2.5 ETH", time: "2 hours ago" },
      { bidder: "ArtLover", amount: "2.2 ETH", time: "4 hours ago" },
      { bidder: "CryptoWhale", amount: "1.8 ETH", time: "6 hours ago" },
      { bidder: "NFTFan", amount: "1.5 ETH", time: "8 hours ago" },
    ],
    totalBids: 24,
  },
  {
    id: "2",
    title: "Neon City Nights",
    description: "A cyberpunk-inspired cityscape with neon lights reflecting off wet streets.",
    image: "/cyberpunk-neon-city.png",
    currentBid: "1.8 ETH",
    startingBid: "0.3 ETH",
    creator: "CyberArt",
    category: "Cyberpunk",
    likes: 892,
    views: 5621,
    endTime: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 hours from now
    bidHistory: [
      { bidder: "TechCollector", amount: "1.8 ETH", time: "1 hour ago" },
      { bidder: "DigitalArt", amount: "1.5 ETH", time: "3 hours ago" },
      { bidder: "CyberFan", amount: "1.2 ETH", time: "5 hours ago" },
    ],
    totalBids: 18,
  },
  {
    id: "3",
    title: "Abstract Geometry",
    description: "Colorful geometric patterns that create a mesmerizing visual experience.",
    image: "/abstract-geometric-digital-art-colorful.jpg",
    currentBid: "3.2 ETH",
    startingBid: "0.8 ETH",
    creator: "GeometryMaster",
    category: "Abstract",
    likes: 1456,
    views: 12340,
    endTime: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
    bidHistory: [
      { bidder: "AbstractLover", amount: "3.2 ETH", time: "30 minutes ago" },
      { bidder: "PatternFan", amount: "2.9 ETH", time: "2 hours ago" },
      { bidder: "ColorCollector", amount: "2.5 ETH", time: "4 hours ago" },
    ],
    totalBids: 31,
  },
]

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate.getTime() - now

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  return timeLeft
}

function AuctionCard({ auction }: { auction: (typeof mockAuctions)[0] }) {
  const timeLeft = useCountdown(auction.endTime)
  const [bidAmount, setBidAmount] = useState("")
  const [isLiked, setIsLiked] = useState(false)

  const minBid = Number.parseFloat(auction.currentBid.replace(" ETH", "")) + 0.1

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
    >
      {/* NFT Image */}
      <div className="relative">
        <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl">
          <img src={auction.image || "/placeholder.svg"} alt={auction.title} className="w-full h-full object-cover" />
        </div>

        {/* Quick Stats */}
        <div className="flex gap-3 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLiked(!isLiked)}
            className={`flex items-center gap-2 ${isLiked ? "text-red-500 border-red-500" : ""}`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            {auction.likes + (isLiked ? 1 : 0)}
          </Button>
          <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-md">
            <Eye className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{auction.views.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-md">
            <Gavel className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{auction.totalBids} bids</span>
          </div>
        </div>
      </div>

      {/* Auction Details */}
      <div className="space-y-6">
        <div>
          <Badge variant="secondary" className="mb-3">
            {auction.category}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{auction.title}</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">{auction.description}</p>
        </div>

        {/* Creator Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Creator</p>
                <p className="font-semibold">{auction.creator}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Countdown Timer */}
        <Card className="border-2 border-orange-500/20 bg-orange-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <Clock className="h-5 w-5" />
              Auction Ends In
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-orange-600">{timeLeft.days}</div>
                <div className="text-sm text-muted-foreground">Days</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{timeLeft.hours}</div>
                <div className="text-sm text-muted-foreground">Hours</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{timeLeft.minutes}</div>
                <div className="text-sm text-muted-foreground">Minutes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{timeLeft.seconds}</div>
                <div className="text-sm text-muted-foreground">Seconds</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Bid & Bidding */}
        <Card className="border-2 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Bid</p>
                <p className="text-3xl font-bold text-primary">{auction.currentBid}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Starting Bid</p>
                <p className="text-lg font-semibold">{auction.startingBid}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex gap-3">
                <Input
                  type="number"
                  placeholder={`Min bid: ${minBid} ETH`}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="flex-1"
                  step="0.1"
                  min={minBid}
                />
                <Button className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600">
                  <Gavel className="h-4 w-4 mr-2" />
                  Place Bid
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Minimum bid: {minBid} ETH (${(minBid * 1700).toLocaleString()} USD)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Bid History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Bid History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {auction.bidHistory.map((bid, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">{bid.bidder.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="font-medium">{bid.bidder}</p>
                        <p className="text-sm text-muted-foreground">{bid.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">{bid.amount}</p>
                    </div>
                  </div>
                  {index < auction.bidHistory.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}

export function AuctionPage() {
  const [selectedAuction, setSelectedAuction] = useState(0)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            Live <span className="text-primary">Auctions</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Bid on exclusive NFTs from top creators. Don't miss out on these limited-time opportunities.
          </p>
        </motion.div>

        {/* Auction Selector */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex gap-4 mb-8 overflow-x-auto pb-4"
        >
          {mockAuctions.map((auction, index) => (
            <button
              key={auction.id}
              onClick={() => setSelectedAuction(index)}
              className={`flex-shrink-0 p-4 rounded-lg border-2 transition-all ${
                selectedAuction === index ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={auction.image || "/placeholder.svg"}
                  alt={auction.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="text-left">
                  <p className="font-semibold text-sm">{auction.title}</p>
                  <p className="text-primary font-bold text-sm">{auction.currentBid}</p>
                </div>
              </div>
            </button>
          ))}
        </motion.div>

        {/* Selected Auction */}
        <AuctionCard auction={mockAuctions[selectedAuction]} />

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Want to List Your NFT for Auction?</h3>
              <p className="text-muted-foreground mb-6">
                Reach thousands of collectors and maximize your NFT's value through our auction platform.
              </p>
              <Link href="/create">
                <Button className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600">
                  <Zap className="h-4 w-4 mr-2" />
                  List for Auction
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
