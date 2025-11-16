"use client"

import type React from "react"

import { FC, useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Textarea } from "@/src/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Badge } from "@/src/components/ui/badge"
import { Upload, ImageIcon, Loader2, Plus, X } from "lucide-react"
import { Progress } from "@/src/components/ui/progress"
import { NftCollection } from "../types/collections"
import { motion } from "framer-motion"
import { Duration, DurationSelector } from "./ui/duration-selector"
import { BrowserProvider } from "ethers"
import { useAppKitProvider, Provider } from "@reown/appkit/react"
import { Cw721Contract__factory } from "../contract-types"
import { toast } from "sonner"


interface CreatePageProps {
  nftCollection: NftCollection[]
}

export const CreateNFTForm: FC<CreatePageProps> = ({ nftCollection }) => {
  const [selectedDesing, setSelectedDesign] = useState(0)
  const currentDesign = nftCollection[selectedDesing]



  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  // const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [properties, setProperties] = useState<Array<{ trait_type: string; value: string }>>([])
  const [sharesBuyDuration, setSharesBuyDuration] = useState<Duration>({ days: 10, hours: 0, minutes: 0 });
  const [auctionDuration, setAuctionDuration] = useState<Duration>({ days: 0, hours: 2, minutes: 30 });
  const [betweenDuration, setBetweenDuration] = useState<Duration>({ days: 1, hours: 0, minutes: 0 });

  const { walletProvider } = useAppKitProvider<Provider>("eip155")

  // const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0]
  //   if (file) {
  //     const reader = new FileReader()
  //     reader.onload = (e) => {
  //       setPreviewImage(e.target?.result as string)
  //     }
  //     reader.readAsDataURL(file)
  //   }
  // }

  const addProperty = () => {
    setProperties([...properties, { trait_type: "", value: "" }])
  }

  const removeProperty = (index: number) => {
    setProperties(properties.filter((_, i) => i !== index))
  }

  const updateProperty = (index: number, field: "trait_type" | "value", value: string) => {
    const updated = [...properties]
    updated[index][field] = value
    setProperties(updated)
  }

  const handleMint = async () => {
    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }


  const handleDesignTokenize = async () => {
    if (!walletProvider) {
      toast.error("Please connect your wallet", {
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
      setIsUploading(true)
      const ethersProvider = new BrowserProvider(walletProvider)
      const signer = await ethersProvider.getSigner()
      const userAddress = signer.address
      const cw721Contract = Cw721Contract__factory.connect(nftCollection[selectedDesing].contract_address, signer)

      // Check if the user is the authorized minter
      const minterResponse = await cw721Contract.minter()
      console.log(minterResponse.minter, "Minter Address")
      const minterAddress = minterResponse.minter as `0x${string}`

      // Proceed with minting
      const tx = await cw721Contract.mint(userAddress, nftCollection[selectedDesing].id)
      console.log("Transaction sent:", tx)

      // Wait for transaction confirmation
      await tx.wait()

      toast.success("NFT minted successfully!", {
        style: {
          background: "linear-gradient(to right, rgba(34, 211, 238, 0.8), rgba(52, 211, 153, 0.8))",
          color: "white",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        },
        position: "top-right",
      })
      console.log("Minting successful:", tx.hash)
    } catch (error: any) {
      console.error("Error in handleDesignTokenize", error)

      // Extract error message
      let errorMessage = "Failed to mint NFT"
      if (error?.reason) {
        errorMessage = error.reason
      } else if (error?.message) {
        errorMessage = error.message
      } else if (typeof error === "string") {
        errorMessage = error
      }

      toast.error(errorMessage, {
        style: {
          background: "rgba(255, 87, 34, 0.8)",
          color: "white",
          border: "1px solid rgba(249, 115, 22, 0.3)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)"
        },
        position: "top-right",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">

          {/* Top card for note */}
          <Card className="border-2 border-orange-500/20 bg-orange-500/5">
            <CardContent className="space-y-6">
              <p className="text-orange-600">For the sake of simplicity we are providing the images to choose from. This won't happen in real world</p>
            </CardContent>
          </Card>

          {/* Second card to show chosen image */}
          <Card className="border-border/50">
            <CardContent className="">
              {currentDesign ? (
                <div className="space-y-4">
                  <img
                    src={currentDesign.image || "/placeholder.svg"}
                    alt="Preview"
                    className="max-w-full h-58 object-cover rounded-lg mx-auto"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto" />
                  <div>
                    <p className="text-foreground font-medium">Choose design to upload</p>
                  </div>
                  <input type="file" accept="image/*" className="hidden" id="file-upload" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Third card to give image options */}
          <Card className="border-border/50 bg-transparent">
            <CardHeader>
              <CardTitle className="text-foreground">Choose Design</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex gap-4 mb-8 overflow-x-auto pb-4"
              >
                {nftCollection.map((auction, index) => (
                  <button
                    key={auction.id}
                    onClick={() => setSelectedDesign(index)}
                    className={`flex-shrink-0 p-4 rounded-lg border-2 transition-all ${selectedDesing === index ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
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
            </CardContent>
          </Card>
        </div>

        {/* Details Section */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground">NFT Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">
                Name
              </Label>
              <Input
                id="name"
                placeholder="Enter NFT name"
                className="bg-background border-border/50 focus:border-cyan-400"
                value={currentDesign.title}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-foreground">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your NFT"
                className="bg-background border-border/50 focus:border-cyan-400 min-h-[100px]"
                value={currentDesign.description}
              />
            </div>

            <div className="space-y-4">
              {properties.map((property, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    placeholder="Trait type"
                    value={property.trait_type}
                    onChange={(e) => updateProperty(index, "trait_type", e.target.value)}
                    className="bg-background border-border/50 focus:border-cyan-400"
                  />
                  <Input
                    placeholder="Value"
                    value={property.value}
                    onChange={(e) => updateProperty(index, "value", e.target.value)}
                    className="bg-background border-border/50 focus:border-cyan-400"
                  />
                  <Button variant="ghost" size="icon" onClick={() => removeProperty(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Durations */}
            <div>
              <Label htmlFor="description" className="text-foreground mb-2">
                Please choose the durations
              </Label>
              <div className="bg-card border border-border/50 rounded-lg p-6 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="shares-buy" className="text-foreground font-medium">
                      Shares Buy Duration *
                    </Label>
                    <DurationSelector
                      value={sharesBuyDuration}
                      onChange={setSharesBuyDuration}
                      placeholder="Select shares buy duration"
                      className="w-full border border-cyan-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="auction" className="text-foreground font-medium">
                      Auction Duration *
                    </Label>
                    <DurationSelector
                      value={auctionDuration}
                      onChange={setAuctionDuration}
                      placeholder="Select auction duration"
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="between" className="text-foreground font-medium">
                      Duration between Shares Buy and Auction *
                    </Label>
                    <DurationSelector
                      value={betweenDuration}
                      onChange={setBetweenDuration}
                      placeholder="Select duration between phases"
                      className="w-full max-w-md"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border/50">
              <Button
                onClick={handleDesignTokenize}
                disabled={isUploading}
                className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Minting...
                  </>
                ) : (
                  "Digitalize Your Design"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Bottom section displaying properties */}
      <div>
        <h3 className="mb-4 px-2 text-xl" >Properties</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {currentDesign.attributes.map((property, index) => (
            <Card key={index}>
              <CardContent className="text-center">
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
      </div>
    </div>
  )
}
