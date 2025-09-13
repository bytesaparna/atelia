"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, Menu, Search, User } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Navigation() {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")

  const connectWallet = async () => {
    // Simulate wallet connection
    setIsConnected(true)
    setWalletAddress("0x742d...4A2f")
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setWalletAddress("")
  }

  const NavLinks = () => (
    <>
      <Link href="/" className="text-foreground hover:text-cyan-400 transition-colors">
        Home
      </Link>
      <Link href="/explore" className="text-foreground hover:text-cyan-400 transition-colors">
        Explore
      </Link>
      <Link href="/create" className="text-foreground hover:text-cyan-400 transition-colors">
        Create
      </Link>
      <Link href="/dashboard" className="text-foreground hover:text-cyan-400 transition-colors">
        Dashboard
      </Link>
    </>
  )

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400 to-emerald-400" />
          <span className="text-xl font-bold text-foreground">CryptoVault</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <NavLinks />
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Search className="h-4 w-4" />
          </Button>

          {isConnected ? (
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                <Wallet className="h-3 w-3 mr-1" />
                {walletAddress}
              </Badge>
              <Button variant="ghost" size="icon" onClick={disconnectWallet}>
                <User className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              onClick={connectWallet}
              className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white font-medium"
            >
              <Wallet className="h-4 w-4 mr-2" />
              Connect Wallet
            </Button>
          )}
        </div>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col space-y-6 mt-6">
              <div className="flex flex-col space-y-4">
                <NavLinks />
              </div>

              <div className="border-t border-border pt-6">
                {isConnected ? (
                  <div className="space-y-4">
                    <Badge
                      variant="secondary"
                      className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 w-full justify-center"
                    >
                      <Wallet className="h-3 w-3 mr-1" />
                      {walletAddress}
                    </Badge>
                    <Button variant="outline" onClick={disconnectWallet} className="w-full bg-transparent">
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={connectWallet}
                    className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white font-medium"
                  >
                    <Wallet className="h-4 w-4 mr-2" />
                    Connect Wallet
                  </Button>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}
