# aex141-nft-collection-example

This repository will guide you through all the steps required to create an NFT collection and NFTs on the æternity blockchain using the [AEX-141](https://github.com/aeternity/AEXs/blob/master/AEXS/aex-141.md) standard.

It demonstrates two different use cases:
- Unique NFTs (e.g. for unique artworks)
- Edition size NFTs (e.g. for gaming)

## Immutable Metadata on IPFS
The immutable metadata of the following example collections is stored on IPFS and referenced in the NFT contract. This way we avoid spamming the chain with unnecessary data while embracing decentralization.

### Considerations
In case you plan to launch a collection your should consider taking actions in following order:

1. Upload media file to IPFS
1. Create JSON file with immutable metadata which includes the reference to the media file on IPFS
   - e.g. `"media_url": "ipfs://QmV8zLF5zBSiKU9go9GXkeCZXeHp7iZQMzpBxnU5eGHSZT"`
1. Upload JSON file with immutable metadata on IPFS
1. Deploy the NFT contract
1. Mint the NFTs which includes the reference to the JSON file on IPFS that contains immutable metadata

This will be demonstrated and explained step by step if you continue reading.

### Example collection: Apes stepping into the Metaverse

For this example we used [DALL-E 2](https://openai.com/dall-e-2) to generate some images based on the text `apes stepping into the metaverse`.

The images have been uploaded and pinned using [Pinata](https://www.pinata.cloud) where you can pin up to 1GB of media for free.

The NFT images of the example collection are stored under [nfts/images](./nfts/images) and their filename reflect the IPFS hash which is used in the `media_url` in the immutable metadata of each NFT ;-)

**Note**:

- If the media isn't pinned anymore and nobody saved the original file the NFT media cannot be fetched anymore.
- When creating NFT collections you (or your community) should ensure that the media is always pinned on IPFS (or other decentralized storage alternatives) either by yourself or by some 3rd party service you typicall have to pay for.
- The IPFS hash will always be the same as long as somebody owning the original media has it stored somewhere, uploads and pins at again on IPFS.

### NFT metadata - overview

| NFT name | File | IPFS hash
| --- | --- | --- |
| Walking on the ladder | [1.json](./nfts/immutable-metadata/1.json) | [QmdXfW9PuiUi6rToxmFMxaiY3Umn6SKGygihhk2oUj1PDu](https://ipfs.io/ipfs/QmdXfW9PuiUi6rToxmFMxaiY3Umn6SKGygihhk2oUj1PDu) |
| The path to heaven | [2.json](./nfts/immutable-metadata/2.json) | [QmQCctL2rnAHvhKNRAFg5iHbtkWcDA1GE1YeacgkWnnxbX](https://ipfs.io/ipfs/QmQCctL2rnAHvhKNRAFg5iHbtkWcDA1GE1YeacgkWnnxbX) |
| Still sitting in the jungle | [3.json](./nfts/immutable-metadata/3.json) | [QmYmQtJR3WHdspFmzUThpKw6WbbuPc5oprPB6fGxsvjmBa](https://ipfs.io/ipfs/QmYmQtJR3WHdspFmzUThpKw6WbbuPc5oprPB6fGxsvjmBa) |
| We almost made it! | [4.json](./nfts/immutable-metadata/4.json) | [QmX8q5hHW6kB7N12YyttfdiBBdQAZ6sjkVbzQa7kRo6Qnn](https://ipfs.io/ipfs/QmX8q5hHW6kB7N12YyttfdiBBdQAZ6sjkVbzQa7kRo6Qnn) |
| I'm in! | [5.json](./nfts/immutable-metadata/5.json) | [QmfMnhj3LoTbYjSfsvbtabHK4CV4zL29E4DpaYPoxkhUnx](https://ipfs.io/ipfs/QmfMnhj3LoTbYjSfsvbtabHK4CV4zL29E4DpaYPoxkhUnx) |
| Utopia is there! | [6.json](./nfts/immutable-metadata/6.json) | [QmajFQ7Q9XrZgqi54vacv3ya2AATyAQ7Bw9wCazYYtWGyJ](https://ipfs.io/ipfs/QmajFQ7Q9XrZgqi54vacv3ya2AATyAQ7Bw9wCazYYtWGyJ) |
| Waiting for my homies! | [7.json](./nfts/immutable-metadata/7.json) | [QmbMuA5vaebD1jzTkSiaTrHxnQ2H8keY76dguS3ANmuShs](https://ipfs.io/ipfs/QmbMuA5vaebD1jzTkSiaTrHxnQ2H8keY76dguS3ANmuShs) |
| There is no way back! | [8.json](./nfts/immutable-metadata/8.json) | [QmdZ6JFCGdQQUEuyeMU7S7Hb929QFt1BgUcZmYg6nEd4E1](https://ipfs.io/ipfs/QmdZ6JFCGdQQUEuyeMU7S7Hb929QFt1BgUcZmYg6nEd4E1) |

### NFT metadata - schema
We're proposing following schema for the immutable metadata referenced in the NFT:

- `name` the name of the NFT
- `description` the description of the NFT
- `media_type` the media type of the NFT
    - e.g. `NONE`, `IMAGE`, `AUDIO`, `VIDEO`, `3D_GLB`, `PDF`, ... (ideally this is defined based on discussions within the community)
- `media_url`
    - e.g. `ipfs://`, `ar://`
    - we recommend to **AVOID** using centralized URLs as this property should be immutable
- `traits`
    - a JSON string representing `map<string, object>` so that basically everything is possible to be represented here

Example:
```json
{
    "name": "Walking on the ladder",
    "description": "They are escaping from earth and stepping into the metaverse!",
    "media_type": "IMAGE",
    "media_url": "ipfs://QmfCr586aHFVk6p2WhTC1Kvcaps24Mtny2CLB5bsTT9MvZ",
    "traits": {
        "apes_count": 2,
        "moon_visible": true
    }
}
```

## Example 1 - Collection with unique NFTs
The first example demonstrates how a collection that includes only unique NFTs could look like.

### Extensions

This example demonstrates the usage of following extensions:
- `mintable`
    - allows the owner/creator of the NFT contract to mint new NFTs
- `burnable`
    - allows the owner (or approved account) to burn an NFT
- `swappable`
    - this extension should only be used if you think you have to migrate the NFT contract and re-issue the NFTs on a new contract

### Dealing with metadata

The [AEX-141](https://github.com/aeternity/AEXs/blob/master/AEXS/aex-141.md) standard is aiming to be very flexible when it comes to dealing with metadata.

#### Contract level: `meta_info`

The `meta_info` specifies general info about the NFT collection:

- `name` the name of the collection
- `symbol` the symbol of the collection
- `base_url` the base-url, in case you want to use the metadata_type `URL` for the collection
    - this property is optional and irrelevant for this example
- `metadata_type` the metadata type to use
    - one of `URL`, `OBJECT_ID`, `MAP`
    - this example demonstrates the usage of `MAP`

#### Usage of `metadata_type`
This example provides the first proposal how to deal with metadata for collections with unique NFTs only and uses the metadata_type `MAP` specified in AEX-141. Following key is used in this example:

- `immutable_metadata_url` pointing to the place where the JSON file with the immutable metadata is stored
    - e.g. `ipfs://QmdXfW9PuiUi6rToxmFMxaiY3Umn6SKGygihhk2oUj1PDu`

Potentially you can add many more custom key-value pairs if needed. E.g. there is also a `mutable_attributes` extension (see example for Edition Size NFT Collection below) where the key `mutable_attributes` is used to store additional (upgradeable) data for an NFT.

## Example 2 - Collection with Edition Size NFTs (Templates)
The second example demonstrates how a collection of edition size NFTs could look like. This is especially interesting for gaming projects where you want to re-use immutable metadata for a specific type of NFT and still have the flexibility to attach mutable attributes to every single NFT.

### Extensions

This example demonstrates the usage of following extensions:
- `mintable_template`
    - allows the owner/creator of the NFT contract to
        - create new templates with immutable metadata
        - mint NFTs based on templates
- `mutable_attributes`
    - allows the owner/creator of the NFT contract to update mutable attributes for NFTs in the collection
- `burnable`
    - allows the owner (or approved account) to burn an NFT
- `swappable`
    - this extension should only be used if you think you have to migrate the NFT contract and re-issue the NFTs on a new contract

### Dealing with metadata

The [AEX-141](https://github.com/aeternity/AEXs/blob/master/AEXS/aex-141.md) standard is aiming to be very flexible when it comes to dealing with metadata.

#### Contract level: `meta_info`

The `meta_info` specifies general info about the NFT collection:

- `name` the name of the collection
- `symbol` the symbol of the collection
- `base_url` the base-url, in case you want to use the metadata_type `URL` for the collection
    - this property is optional and irrelevant for this example
- `metadata_type` the metadata type to use
    - one of `URL`, `OBJECT_ID`, `MAP`
    - this example demonstrates the usage of `MAP`

#### Usage of `metadata_type`
This example provides the first proposal how to deal with metadata for collections with unique NFTs only and uses the metadata_type `MAP` specified in AEX-141. Following key is used in this example:

- `template_id` defines the template the NFT is based on
    - the template has to be created before
    - the template includes following properties:
        - `immutable_metadata_url` pointing to the place where the JSON file with the immutable metadata is stored
            - e.g. `ipfs://QmdXfW9PuiUi6rToxmFMxaiY3Umn6SKGygihhk2oUj1PDu`
        - `edition_size` the max amount of NFTs that can be minted using the template (MUST be > 0)
        - `edition_mint_count` the number of NFTs that have already been minted using the template
            - this value is incremented on each new NFT mint
- `edition_serial` defines the serial no of the minted NFT

After mint:
- `mutable_attributes` stores mutable attributes in a JSON string

**Note:** You can of course also implement a custom `template_mint_mutable` entrypoint where you can pass mutable attributes directly on minting.

## Deployment & Minting

With the following example scripts you can easily test deployment on the official testnet. For mainnet almost identical steps can be executed. Of course you need some Æ to cover the transaction fees.

### Create keypair and get some Æ on testnet
Check out the quick start guide to learn how to create a keypair and how to fund your account:

- https://docs.aeternity.com/aepp-sdk-js/latest/quick-start/

Alternatively just execute the [create_keypair_and_fund_account.js](./scripts/create_keypair_and_fund_account.js) script as follows:

`node ./scripts/create_keypair_and_fund_account.js`

It will print the following output to the console:

```
Secret key: sure ;-)
Public key: ak_QVSUoGrJ31CVxWpvgvwQ7PUPFgnvWQouUgsDBVoGjuT7hjQYW
Balance: 5000000000000000000 ættos
```

### Deploy & Mint Collection with unique NFTs

The [deployAndMintCollectionUniqueNFTs.js](./scripts/deployAndMintCollectionUniqueNFTs.js) script demonstrates how you can use the SDK programmatically to deploy and mint your NFTs on the testnet. If you run the following command, the contract will be deployed and the NFTs will be minted according to the data defined in [collection_unique_nfts.json](./nfts/collection_unique_nfts.json):

`SECRET_KEY=<your_secret_key> node ./scripts/deployAndMintCollectionUniqueNFTs.js`

Alternatively you can set the env variable `SECRET_KEY` in your terminal and just run `node ./scripts/deployAndMintCollectionUniqueNFTs.js`.

<details>
    <summary>Show console output</summary>

```sh
Deploying with account: ak_8Ujt76QfpT1DyYsNZKGPGtMZ2C2MFf7CcnpQvJWNsX6szZkYN
==> Adding include to filesystem: core/utils.aes
==> Adding include to filesystem: core/IAEX141NFTReceiver.aes
Contract successfully deployed!
Contract address: ct_dSGgQYXE8mEDnfLXTJCYRmDpN6a2ojJtn4WXhRtwoZydf5w2v
Tx-Hash: th_24LXvXRMLEYjAVrLP57sAm1AaSKAfaszskETb8qbWGckUgcejL
Gas used: 1190
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Minted NFT with id '1'
Tx-Hash: th_nZN9FP4caxbm8U9gMo5fm6topHYztdvx5vDrqVriEwY8L5ief
Gas used: 17605
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Minted NFT with id '2'
Tx-Hash: th_ziyWeup5krGL24PBd5h8X5eBe5E5c2XkdonvDPAomzym36k8h
Gas used: 18295
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Minted NFT with id '3'
Tx-Hash: th_2jmM1DqVFCv3nAxtVDFf7LRKYq62Ws3oHjYHx1cxZTxU6WqEKJ
Gas used: 18067
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Minted NFT with id '4'
Tx-Hash: th_bwbGG3j3Y8S95vV1RTb5X2cWTUPkayiBxT1GHFXzdgcntqXXS
Gas used: 17697
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Minted NFT with id '5'
Tx-Hash: th_edWWPmXdyhNJpjDLevLXWjP6xMGTyDDPWmAuGhY1mDtpRb8Bn
Gas used: 17710
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Minted NFT with id '6'
Tx-Hash: th_76NpRi3sxdKy8QyoEjVCjSW5Si3gXmPrk55RNtTzNryoGWHSx
Gas used: 17723
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Minted NFT with id '7'
Tx-Hash: th_2NsegGTB2QT1voCxZHF7aDPFoTGb7WpXdyR5yooftH8hTunUeE
Gas used: 17736
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Minted NFT with id '8'
Tx-Hash: th_2YN87aSrWS5rEdKxgrXsYy541igY2T5RPuqZwn1Q6DQTMLFW3y
Gas used: 17749
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
```
</details>

### Deploy & Mint Collection with edition size NFTs (Templates)
TODO

## Simple-NFT-Viewer (TODO -> update to new exmaples!!!)
**Note:** still using an old, outdated example to display the NFTs

This repository also provides you an example frontend, the [Simple-NFT-Viewer](./simple-nft-viewer) which is written in Vue.js.

It fetches the NFT metadata from contract [ct_Fv9d66QTjr4yon9GEuMRc2B5y7Afy4to1ATaoYmpUTbN6DYiP](https://explorer.testnet.aeternity.io/contracts/transactions/ct_Fv9d66QTjr4yon9GEuMRc2B5y7Afy4to1ATaoYmpUTbN6DYiP) and displays:
 - Name of the NFT collection
 - Name, Description and Image of all NFTs

## Congratulations
Now you know everything to get started with minting your own and unique NFT collection on the æternity blockhain :-)