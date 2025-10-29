"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Progress } from "@/src/components/ui/progress"
import { Eye, Heart, Plus, Edit3, Share2, MoreHorizontal, Calendar, Award, Users, DollarSign, ExternalLink } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { api } from "../trpc/clients"
import { useAppKitAccount } from "@reown/appkit/react"
import Link from "next/link"
import { TOKEN_DENOM } from "../config/app-config"
import { useQuery } from "@tanstack/react-query"

const userStats = {
  totalEarnings: "45.7",
  totalNFTs: 23,
  totalViews: 12450,
  totalLikes: 3420,
  followers: 1250,
  following: 340,
  rank: 42,
  joinDate: "March 2023",
}

const earningsData = [
  { month: "Jan", earnings: 12.5 },
  { month: "Feb", earnings: 18.2 },
  { month: "Mar", earnings: 25.1 },
  { month: "Apr", earnings: 32.4 },
  { month: "May", earnings: 28.7 },
  { month: "Jun", earnings: 45.7 },
]

const categoryData = [
  { name: "Digital Art", value: 45, color: "#06b6d4" },
  { name: "Photography", value: 25, color: "#10b981" },
  { name: "Abstract", value: 20, color: "#8b5cf6" },
  { name: "Other", value: 10, color: "#f59e0b" },
]


const recentActivity = [
  { type: "sale", description: "Neon Cityscape sold for 2.8 STT", time: "2 hours ago" },
  { type: "like", description: "Someone liked Cosmic Dreams #001", time: "4 hours ago" },
  { type: "follow", description: "CryptoCollector started following you", time: "1 day ago" },
  { type: "mint", description: "Abstract Flow minted successfully", time: "3 days ago" },
]


export function UserDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const { address } = useAppKitAccount()
  const { data: userShareBalanceOfAllNfts } = api.collections.userSharesBalanceOfAllNfts.useQuery({ userAddress: address ?? "", })
  console.log(userShareBalanceOfAllNfts, "User share balance of all nfts")
  const tokens = userShareBalanceOfAllNfts?.map(item => item.token) ?? []
  const userShareBalance = userShareBalanceOfAllNfts?.map(item => item.balance) ?? []
  const tokenIds = userShareBalanceOfAllNfts?.map(item => item.token_id) ?? []

  const { data: highestBids } = api.auction.queryLatestAuctionBiddersForProvidedTokens.useQuery({ tokens: tokenIds })
  console.log(highestBids, "Highest bids (batch)")

  const { data: highestBid } = api.auction.highestBid.useQuery({ token_id: tokenIds[0] })
  console.log(highestBid, "Highest bid (single - for comparison)")
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="mb-8">
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/placeholder.svg?height=80&width=80" />
                <AvatarFallback className="bg-gradient-to-br from-cyan-400 to-emerald-400 text-white text-xl">
                  JD
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">John Doe</h1>
                    <p className="text-muted-foreground">@johndoe_artist</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Joined {userStats.joinDate}
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="h-4 w-4" />
                        Rank #{userStats.rank}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button variant="outline">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{userStats.totalNFTs}</p>
                    <p className="text-sm text-muted-foreground">NFTs Created</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{userStats.followers}</p>
                    <p className="text-sm text-muted-foreground">Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{userStats.following}</p>
                    <p className="text-sm text-muted-foreground">Following</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{userStats.totalEarnings} STT</p>
                    <p className="text-sm text-muted-foreground">Total Earnings</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="nfts">My NFTs</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Earnings</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{userStats.totalEarnings} STT</div>
                <p className="text-xs text-emerald-400">+12.5% from last month</p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{userStats.totalViews.toLocaleString()}</div>
                <p className="text-xs text-cyan-400">+8.2% from last month</p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Likes</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{userStats.totalLikes.toLocaleString()}</div>
                <p className="text-xs text-emerald-400">+15.3% from last month</p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Followers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{userStats.followers}</div>
                <p className="text-xs text-cyan-400">+5.7% from last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-foreground">Earnings Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300} children={
                  <LineChart data={earningsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="earnings"
                      stroke="#06b6d4"
                      strokeWidth={2}
                      dot={{ fill: "#06b6d4", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                }>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-foreground">NFT Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300} children={
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                }>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-4 mt-4">
                  {categoryData.map((category, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                      <span className="text-sm text-muted-foreground">{category.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="nfts" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-foreground">My NFTs</h2>
            <Button className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600">
              <Plus className="h-4 w-4 mr-2" />
              Create NFT
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tokens.map((nft, index) => (
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
                    <p className="text-sm text-muted-foreground">
                      Expected return {" "}
                      {(((Number(highestBids?.[index]) - nft.appStatus.price_based_on_buy) / nft.appStatus.price_based_on_buy) * 100).toFixed(2)}{" "}%
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Your Balance</p>
                        <p className="font-semibold text-foreground">{userShareBalance[index]} {TOKEN_DENOM}</p>
                      </div>
                      {/* <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {nft.likes}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {nft.views}
                        </div>
                      </div> */}
                    </div>
                    <Button className="flex-1 w-full bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600">
                      <Link href={`/nft/${nft.id}/#buy-now-details`}>Redeem</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Analytics</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-foreground">Monthly Views</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300} children={
                  <BarChart data={earningsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="earnings" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                }>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-foreground">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Engagement Rate</span>
                    <span className="text-foreground">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Conversion Rate</span>
                    <span className="text-foreground">12%</span>
                  </div>
                  <Progress value={12} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Return Visitors</span>
                    <span className="text-foreground">45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Average Time on Page</span>
                    <span className="text-foreground">2m 34s</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Recent Activity</h2>

          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 pb-4 border-b border-border/50 last:border-b-0 last:pb-0"
                  >
                    <div
                      className={`p-2 rounded-full ${activity.type === "sale"
                        ? "bg-emerald-500/20"
                        : activity.type === "like"
                          ? "bg-red-500/20"
                          : activity.type === "follow"
                            ? "bg-blue-500/20"
                            : "bg-purple-500/20"
                        }`}
                    >
                      {activity.type === "sale" && <DollarSign className="h-4 w-4 text-emerald-400" />}
                      {activity.type === "like" && <Heart className="h-4 w-4 text-red-400" />}
                      {activity.type === "follow" && <Users className="h-4 w-4 text-blue-400" />}
                      {activity.type === "mint" && <Plus className="h-4 w-4 text-purple-400" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground">{activity.description}</p>
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
