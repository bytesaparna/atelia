import { CreateNFTForm } from "@/src/components/create-nft-form"
import { RPC_PROVIDER } from "@/src/lib/evm-helper";
import { queryNftCollections } from "@/src/server/api/collections/queries";

export default async function CreatePage() {
  const nftCollections = await queryNftCollections(RPC_PROVIDER);
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">Create Your NFT</h1>
            <p className="text-muted-foreground text-lg">
              Turn your digital art into a unique collectible on the blockchain
            </p>
          </div>
          <CreateNFTForm  nftCollection={nftCollections}/>
        </div>
      </div>
    </main>
  )
}
