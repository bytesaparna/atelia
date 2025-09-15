"use client"

import { useParams } from "next/navigation"
import { NFTDetail } from "@/src/components/nft-detail"

export default function NFTDetailPage() {
    const params = useParams()
    const id = params.id as string

    return <NFTDetail id={id} />
}
