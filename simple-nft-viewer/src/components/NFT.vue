<template>
  <h1 v-if="metaInfo">
    {{ metaInfo.name }}
  </h1>
  <div v-for="nft in nfts" :key="nft.name" class="nft">
    <h2>{{ nft.name }}</h2>
    <h3>{{ nft.description }}</h3>
    <img :alt="nft.description" :src="nft.image_url" width="300" />
  </div>
</template>

<script>
import { AeSdk, Node } from "@aeternity/aepp-sdk";
import MintableMutableNFT from "@/assets/contracts/MintableMutableNFT.aes";
import CoreUtils from "@/assets/contracts/core/utils.aes";
import CoreIAEX141NFTReceiver from "@/assets/contracts/core/IAEX141NFTReceiver.aes";

export default {
  name: "NFT",
  data() {
    return {
      metaInfo: null,
      nfts: [],
    };
  },
  methods: {
    initSdk() {
      return new AeSdk({
        compilerUrl: "https://compiler.aeternity.io",
        nodes: [
          {
            name: "ae_uat",
            instance: new Node("https://testnet.aeternity.io"),
          },
        ],
      });
    },
    async initContract() {
      const aeSdk = this.initSdk();
      const contract = await aeSdk.getContractInstance({
        source: MintableMutableNFT,
        contractAddress: "ct_7oGmkvxzYXR2Pypvf5Pbj3x3VSmB8SwQgii1uScy9jAWWurL5",
        fileSystem: {
          "core/utils.aes": CoreUtils,
          "core/IAEX141NFTReceiver.aes": CoreIAEX141NFTReceiver,
        },
      });

      this.metaInfo = await contract.methods
        .meta_info()
        .then((res) => res.decodedResult);

      this.nfts = await Promise.all(
        [...new Array(8)].map(async (_, i) => {
          const { decodedResult: metadata } = await contract.methods.metadata(
            i + 1
          );

          return {
            name: metadata["MetadataMap"][0].get("name"),
            description: metadata["MetadataMap"][0].get("description"),
            image_url: metadata["MetadataMap"][0]
              .get("media_url")
              .replace("ipfs://", "https://cloudflare-ipfs.com/ipfs/"),
          };
        })
      );
    },
  },
  mounted() {
    this.initContract();
  },
};
</script>

<style scoped>
.nft {
  margin: 4rem 0;
}
</style>
