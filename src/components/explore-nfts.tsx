"use client"

import { FC, useMemo, useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent } from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { Badge } from "@/src/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Search, Grid3X3, List, Heart, Eye, Link2, ExternalLink } from "lucide-react"
import Link from "next/link"
import { NftCollection } from "../types/collections"
import { TOKEN_DENOM } from "../config/app-config"
import { Countdown } from "./ui/countdown"


interface ExploreNFTsProps {
  nftCollections: NftCollection[]
}


const ExploreNFTs: FC<ExploreNFTsProps> = ({ nftCollections }) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("trending")

  const categories = useMemo(() => {
    return nftCollections.map(n => n.category).filter((category, index, self) => self.indexOf(category) === index)
  }, [nftCollections])

  const filteredNFTs = nftCollections.filter((nft) => {
    const matchesSearch =
      nft.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nft.creator.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || nft.category.toLowerCase() === selectedCategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  const sortedNFTs = [...filteredNFTs].sort((a, b) => {
    switch (sortBy) {
      case "price-high":
        return b.price - a.price
      case "price-low":
        return a.price - b.price
      case "likes":
        return b.likes - a.likes
      case "views":
        return b.views - a.views
      default:
        return b.likes + b.views - (a.likes + a.views)
    }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">Explore NFTs</h1>
        <p className="text-muted-foreground text-lg">
          Discover unique digital collectibles from talented creators worldwide
        </p>
      </div>

      {/* Filters and Search */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search NFTs or creators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background border-border/50 focus:border-cyan-400"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[180px] bg-background border-border/50 focus:border-cyan-400">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px] bg-background border-border/50 focus:border-cyan-400">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trending">Trending</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="likes">Most Liked</SelectItem>
                <SelectItem value="views">Most Viewed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button variant={viewMode === "grid" ? "default" : "ghost"} size="icon" onClick={() => setViewMode("grid")}>
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "ghost"} size="icon" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{sortedNFTs.length} items</span>
          {searchQuery && <span>• Results for "{searchQuery}"</span>}
          {selectedCategory !== "all" && <span>• {selectedCategory}</span>}
        </div>
      </div>

      {/* NFT Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedNFTs.map((nft) => (
            <Card
              key={nft.id}
              className="group border-border/50 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/10 pt-0"
            >
              <CardContent className="p-0">
                <Link href={`/nft/${nft.id}`}>
                  <div className="relative overflow-hidden rounded-t-lg cursor-pointer">
                    <img
                      src={nft.thumbnail || "/placeholder.svg"}
                      alt={nft.title}
                      className="w-full h-88 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <a href={`https://shannon-explorer.somnia.network/token/${nft.contract_address}/instance/${nft.id}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="bg-black/50 hover:bg-black/70 text-white">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </a>
                    </div>
                    {nft.verified && (
                      <Badge className="absolute top-2 left-2 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                        Verified
                      </Badge>
                    )}
                  </div>
                </Link>

                <div className="p-4 space-y-3">
                  <Link href={`/nft/${nft.id}`}>
                    <h3 className="font-semibold text-foreground group-hover:text-cyan-400 transition-colors cursor-pointer">
                      {nft.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground">by {nft.creator}</p>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Price</p>
                      <p className="font-semibold text-foreground">{nft.price} {TOKEN_DENOM}</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {nft.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {nft.views}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Countdown
                      targetDate={nft.appStatus.buy_end_time}
                      className="flex-1"
                    />
                  </div>
                  <Button className="flex-1 w-full bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600">
                    Buy Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedNFTs.map((nft) => (
            <Card key={nft.id} className="border-border/50 hover:border-cyan-400/50 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Link href={`/nft/${nft.id}`}>
                    <img
                      src={nft.thumbnail || "/placeholder.svg"}
                      alt={nft.title}
                      className="w-16 h-16 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  </Link>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <Link href={`/nft/${nft.id}`}>
                          <h3 className="font-semibold text-foreground hover:text-cyan-400 transition-colors cursor-pointer">
                            {nft.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground">by {nft.creator}</p>
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {nft.category}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">{nft.price} ETH</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {nft.likes}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {nft.views}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center flex-row">
                    <Countdown
                      targetDate={nft.appStatus.buy_end_time}
                      className="flex-1"
                    />
                    <Button className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600">
                      Buy Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {sortedNFTs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No NFTs found matching your criteria</p>
          <Button
            variant="outline"
            className="mt-4 bg-transparent"
            onClick={() => {
              setSearchQuery("")
              setSelectedCategory("all")
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}


export default ExploreNFTs;