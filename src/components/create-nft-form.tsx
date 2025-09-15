"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Textarea } from "@/src/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Badge } from "@/src/components/ui/badge"
import { Upload, ImageIcon, Loader2, Plus, X } from "lucide-react"
import { Progress } from "@/src/components/ui/progress"

export function CreateNFTForm() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [properties, setProperties] = useState<Array<{ trait_type: string; value: string }>>([])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Upload Section */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground">Upload File</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center hover:border-cyan-400/50 transition-colors">
            {previewImage ? (
              <div className="space-y-4">
                <img
                  src={previewImage || "/placeholder.svg"}
                  alt="Preview"
                  className="max-w-full h-48 object-cover rounded-lg mx-auto"
                />
                <Button variant="outline" onClick={() => setPreviewImage(null)}>
                  Change Image
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <p className="text-foreground font-medium">Choose file to upload</p>
                  <p className="text-muted-foreground text-sm">PNG, JPG, GIF up to 10MB</p>
                </div>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="file-upload" />
                <Button asChild variant="outline">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Browse Files
                  </label>
                </Button>
              </div>
            )}
          </div>

          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Uploading to IPFS...</span>
                <span className="text-foreground">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Section */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground">NFT Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              Name *
            </Label>
            <Input
              id="name"
              placeholder="Enter NFT name"
              className="bg-background border-border/50 focus:border-cyan-400"
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
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="collection" className="text-foreground">
              Collection
            </Label>
            <Select>
              <SelectTrigger className="bg-background border-border/50 focus:border-cyan-400">
                <SelectValue placeholder="Select collection" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="digital-art">Digital Art</SelectItem>
                <SelectItem value="photography">Photography</SelectItem>
                <SelectItem value="music">Music</SelectItem>
                <SelectItem value="gaming">Gaming</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-foreground">Properties</Label>
              <Button variant="outline" size="sm" onClick={addProperty}>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>

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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="royalty" className="text-foreground">
                Royalty (%)
              </Label>
              <Input
                id="royalty"
                type="number"
                placeholder="10"
                max="50"
                className="bg-background border-border/50 focus:border-cyan-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price" className="text-foreground">
                Price (ETH)
              </Label>
              <Input
                id="price"
                type="number"
                step="0.001"
                placeholder="0.1"
                className="bg-background border-border/50 focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-border/50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-foreground font-medium">Minting Fee</span>
              <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                0.005 ETH
              </Badge>
            </div>

            <Button
              onClick={handleMint}
              disabled={isUploading || !previewImage}
              className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Minting...
                </>
              ) : (
                "Create NFT"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
