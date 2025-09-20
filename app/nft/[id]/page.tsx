import { NFTDetail } from "@/src/components/nft-detail"
import { queryNftCollection } from "@/src/server/api/collections/queries"
import { RPC_PROVIDER } from "@/src/lib/evm-helper"

interface NFTDetailPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function NFTDetailPage({ params }: NFTDetailPageProps) {
    const { id } = await params
    const nftCollection = await queryNftCollection(Number(id), RPC_PROVIDER)();

    return <NFTDetail nft={nftCollection} />
}
