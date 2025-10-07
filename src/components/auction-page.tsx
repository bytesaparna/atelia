"use client"

import { useState, useEffect, FC } from "react"
import { motion } from "motion/react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { Badge } from "@/src/components/ui/badge"
import { Clock, Gavel, TrendingUp, Zap, Heart, Eye, User, Nfc } from "lucide-react"
import Link from "next/link"
import { NftCollection } from "../types/collections"
import { Countdown } from "./ui/countdown"
import { TOKEN_DENOM } from "../config/app-config"
import { api } from "../trpc/clients"
import { BrowserProvider, formatUnits, parseEther } from "ethers"
import { useAppKitAccount, useAppKitProvider, Provider } from "@reown/appkit/react"
import { toast } from "sonner"
import { AuctionContract__factory } from "../contract-types"


function AuctionCard({ auction }: { auction: NftCollection }) {
  const [bidAmount, setBidAmount] = useState<number>(1)
  const [isLiked, setIsLiked] = useState(false);
  const { address } = useAppKitAccount()
  const { walletProvider } = useAppKitProvider<Provider>("eip155");
  const utils = api.useUtils();

  const { data: highestBidder } = api.auction.highestBid.useQuery({
    token_id: auction.id
  })

  const highest_price = highestBidder?.high_bidder_amount || auction.appStatus.min_bid_price

  const handlePlaceBid = async (amount: number) => {
    if (!address) {
      toast.error("Connect wallet to start bidding", {
        style: {
          background: "rgba(255, 87, 34, 0.8)",
          color: "white",
          border: "1px solid rgba(249, 115, 22, 0.3)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)"
        },
        position: "top-right",
      })
      return
    }
    try {
      const ethersProvider = new BrowserProvider(walletProvider)
      const signer = await ethersProvider.getSigner();
      console.log(auction.appStatus.auction_start_time, auction.appStatus.auction_end_time, "Auction Start Time");
      const contract = AuctionContract__factory.connect(auction.appStatus.auction_address, signer)
      const bidValue = parseEther(bidAmount.toString())
      // Send the transaction
      const tx = await contract["bid(uint256)"](auction.id, { value: bidValue });
      await tx.wait()
      toast.success("Bid placed successfully!", {
        style: {
          background: "linear-gradient(to right, #22d3ee, #34d399)",
          color: "white",
        },
        position: "top-right",
      })
      // Refresh the highest bid data
      await utils.auction.highestBid.invalidate({ token_id: auction.id })
    } catch (error: any) {
      console.error("Error placing bid:", error)
      const reason = error?.reason ?? error.message
      toast.error(reason || "Error placing bid", {
        position: "top-right",
        style: {
          background: "rgba(255, 87, 34, 0.8)",
          color: "white",
          border: "1px solid rgba(249, 115, 22, 0.3)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)"
        },
      })
    }
  }

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
            <Countdown
              targetDate={auction.appStatus.auction_end_time}
              className="flex-1"
            />
          </CardContent>
        </Card>

        {/* Current Bid & Bidding */}
        <Card className="border-2 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Bid</p>
                <p className="text-3xl font-bold text-primary">{highest_price}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Starting Bid</p>
                <p className="text-lg font-semibold">{auction.appStatus.min_bid_price}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex gap-3">
                <Input
                  placeholder={`Min bid: ${highest_price + auction.appStatus.min_raise_price} ${TOKEN_DENOM}`}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(Number(e.target.value))}
                  className="flex-1 border border-primary/20"
                  step="0.1"
                  min={highest_price + auction.appStatus.min_raise_price}
                />
                <Button className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600" onClick={() => handlePlaceBid(bidAmount)}>
                  <Gavel className="h-4 w-4 mr-2" />
                  Place Bid
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Minimum bid: {highest_price + auction.appStatus.min_raise_price} {TOKEN_DENOM} (${(highest_price + auction.appStatus.min_raise_price * 1700).toLocaleString()} USD)
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
              Coming Soon
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}

interface AuctionPageProps {
  nftCollection: NftCollection[]
}

const AuctionPage: FC<AuctionPageProps> = ({ nftCollection }) => {
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
          {nftCollection.map((auction, index) => (
            <button
              key={auction.id}
              onClick={() => setSelectedAuction(index)}
              className={`flex-shrink-0 p-4 rounded-lg border-2 transition-all ${selectedAuction === index ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
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
                </div>
              </div>
            </button>
          ))}
        </motion.div>


        {nftCollection[selectedAuction] ? (
          <AuctionCard auction={nftCollection[selectedAuction]} />
        ) : (
          <div className="text-center">
            <p className="text-muted-foreground">No auction selected</p>
          </div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Cannot find an auction you are looking for?</h3>
              <p className="text-muted-foreground mb-6">
                Explore our collections and find the perfect auction for you.
              </p>
              <Link href="/explore">
                <Button className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600">
                  <Zap className="h-4 w-4 mr-2" />
                  Explore Collections
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}


export default AuctionPage