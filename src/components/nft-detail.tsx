"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Heart, Share2, Flag, Eye, TrendingUp, Clock, User, Zap, ExternalLink } from "lucide-react"
import Link from "next/link"
import { NftCollection, TokenState } from "../types/collections"
import { Countdown } from "./ui/countdown"
import { TOKEN_DENOM } from "../config/app-config"
import { api } from "../trpc/clients"
import { Input } from "./ui/input"
import { Progress } from "./ui/progress"
import { PromiseButton } from "./promise-button"

interface NFTDetailProps {
  nft: NftCollection
}

export function NFTDetail({ nft }: NFTDetailProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const [purchaseShareAmount, setPurchaseShareAmount] = useState<number>(1)
  const [payAmount, setPayAmount] = useState<number>(0)
  const { data: sharesData } = api.exchange.buyConfig.useQuery({ token_id: nft.id })
  const handlePurchaseShare = () => {
    console.log("CLICKED")
    console.log(payAmount, "PAYAMOUNT")
  }

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
              <div className="absolute top-2 right-2">
                <a href={`https://shannon-explorer.somnia.network/token/${nft.contract_address}/instance/${nft.id}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="bg-black/50 hover:bg-black/70 text-white">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              </div>
              <img src={nft.thumbnail || "/placeholder.svg"} alt={nft.title} className="w-full h-full object-cover" />
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
                      <p className="font-semibold">{nft.creator.slice(0, 6)}...{nft.creator.slice(-4)}</p>
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
                      <p className="font-semibold">{nft.creator.slice(0, 6)}...{nft.creator.slice(-4)}</p>
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
                <p className="text-2xl font-bold text-foreground">#{nft.id}</p>
                <p className="text-sm text-muted-foreground">Rank</p>
              </div>
            </div>

            {/* Price & Purchase */}
            <Card className="border-2 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Current Price</p>
                    <p className="text-3xl font-bold text-primary">{nft.appStatus.price_based_on_buy}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{nft.appStatus.share_buy_price} {TOKEN_DENOM} per share</p>
                  </div>
                </div>

                <div className="flex justify-between gap-6 w-full">
                  <div className="flex flex-1 flex-col gap-2">
                    <p className="text-xs text-gray-400">Shares to buy</p>
                    <div>
                      <Input
                        placeholder="1"
                        className=" pr-16 border-1 border-emerald-400/50 !bg-transparent"
                        value={purchaseShareAmount}
                        max={sharesData?.amount}
                        min={1}
                        onChange={(e) => {
                          const val = Number(e.target.value)
                          const maxVal = sharesData?.amount ?? 0
                          const clampedVal = Math.max(0, Math.min(val, maxVal)) // clamp value
                          setPurchaseShareAmount(clampedVal)
                          setPayAmount(clampedVal * nft.appStatus.share_buy_price)
                        }}
                      />
                    </div>
                    <PromiseButton id="buy-now-details" disabled={nft.appStatus.state !== TokenState.BUY} className="flex-1 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600"
                      onClick={handlePurchaseShare}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      <Link href="#buy-now-details">Buy Now for {purchaseShareAmount * nft.appStatus.share_buy_price} {TOKEN_DENOM}</Link>
                    </PromiseButton>
                  </div>
                  <Countdown
                    targetDate={nft.appStatus.buy_end_time}
                    className="flex"
                  />
                </div>
                <div className=" mt-6">
                  <div className="flex justify-between">
                    <p className="text-sm text-muted-foreground mb-1">Sold Shares ({sharesData?.exchanged_amount})</p>
                    <p className="text-sm text-muted-foreground mb-1">Total Shares ({sharesData?.amount})</p>
                  </div>
                  <Progress value={sharesData?.exchanged_amount} className="w-[100%]" />
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
                className={`pb-3 px-1 text-sm font-medium capitalize transition-colors ${activeTab === tab
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
                    <span className="font-mono text-sm">{nft.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Blockchain</span>
                    <span>Somnia Testnet</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "properties" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {nft.attributes.map((property, index) => (
                <Card key={index}>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">{property.trait_type}</p>
                    <p className="font-semibold mb-2">{property.value}</p>
                    {property.rarity && (
                      <Badge variant="secondary" className="text-xs">
                        {property.rarity} have this trait
                      </Badge>
                    )}
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
                  Coming soon
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  )
}
