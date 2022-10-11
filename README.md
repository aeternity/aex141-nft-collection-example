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

### Contract

The following contract is used for showcasing unique NFTs:
- [CollectionUniqueNFTs.aes](./contracts/CollectionUniqueNFTs.aes)

### Extensions

This example demonstrates the usage of following extensions:
- `mintable`
    - allows the owner/creator of the NFT contract to mint new NFTs
- `burnable`
    - allows the owner (or approved account) to burn an NFT

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

### Contract

The following contract is used for showcasing editon size NFTs with templates:
- [CollectionTemplateEditionNFTs.aes](./contracts/CollectionTemplateEditionNFTs.aes)

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
==> Adding include to filesystem: ./core/utils.aes
==> Adding include to filesystem: ./core/IAEX141NFTReceiver.aes
Contract successfully deployed!
Contract address: ct_7UNRFTFazecMWA13WzZui6eqwbAit4WEApytasiGcNnWcfUwh
Tx-Hash: th_2NjMwydgnkwnUXjzV9y3ZMpznamrSeVNaGvJtwhNMdgPi38Gbf
Gas used: 1159
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 190
Minted NFT with id '1'
Tx-Hash: th_2hNaZDU95vtBKnuoUbao2cyuvfyJ4eprt3fRa6FRCFYV5Rzi5u
Gas used: 17625
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 191
Minted NFT with id '2'
Tx-Hash: th_k18kpanZfddDhtEk1MfWSEmikRfm3fvu44nbaYZS8emHUVneD
Gas used: 18315
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 192
Minted NFT with id '3'
Tx-Hash: th_2QYZTRNvrVfZ3XWFdNAec18uBV7msLxx7R3jLek857X6hs5Mw5
Gas used: 18087
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 193
Minted NFT with id '4'
Tx-Hash: th_2P2TY4uGsSKbikmqQgVSgqHz2WHPh9RGLKKGvZ2gUsumQiM9yw
Gas used: 17717
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 194
Minted NFT with id '5'
Tx-Hash: th_2aoXUBqih6P9eY66MfwGbdXzA75tb9QAiZkRMYRpzUUjGjWrsE
Gas used: 17730
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 195
Minted NFT with id '6'
Tx-Hash: th_zQ2s3dGQijrdFWyMTrSzY9DJRMXgoJZAjf3AVPRK1Qn4CzxKH
Gas used: 17743
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 196
Minted NFT with id '7'
Tx-Hash: th_2XHHHPTve2HwsDwk1xtVaVu5DwoPbVQrD9rtreLyA1ERKaCJ7e
Gas used: 17756
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 197
Minted NFT with id '8'
Tx-Hash: th_xn6iSVA1hQ4siQ2jGcRVcw9UDKDyyYf2yhSHosasQW7BXuHVq
Gas used: 17769
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
```
</details>

### Deploy & Mint Collection with edition size NFTs (Templates)

The [deployAndMintCollectionTemplateEditionNFTs.js](./scripts/deployAndMintCollectionTemplateEditionNFTs.js) script demonstrates how you can use the SDK programmatically to deploy and mint your NFTs on the testnet. If you run the following command, the contract will be deployed, templates will be created and all the NFTs will be minted according to the data defined in [collection_templates.json](./nfts/collection_templates.json):

`SECRET_KEY=<your_secret_key> node ./scripts/deployAndMintCollectionTemplateEditionNFTs.js`

Alternatively you can set the env variable `SECRET_KEY` in your terminal and just run `node ./scripts/deployAndMintCollectionTemplateEditionNFTs.js`.

<details>
    <summary>Show console output</summary>

```sh
Deploying with account: ak_8Ujt76QfpT1DyYsNZKGPGtMZ2C2MFf7CcnpQvJWNsX6szZkYN
==> Adding include to filesystem: ./core/utils.aes
==> Adding include to filesystem: ./core/IAEX141NFTReceiver.aes
Contract successfully deployed!
Contract address: ct_ouWFCU2Qg6v7dgFpjRc3jAfcaRhb9iByPRBDjXSJoA8fRrQ4j
Tx-Hash: th_n5yBuJYYp7VwLM5Px5hQwSRq8WWPTQuF1YwnKGJXQUBR3w8aR
Gas used: 1229
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 199
Created template with id '1'
Tx-Hash: th_2PGQnL1rWB4R7vq6XBtmohwAy1dSwPVBdY97tH84KYsE7LcQpY
Gas used: 9532
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 200
Minted NFT with id '1' of template with id '1'
Tx-Hash: th_3rcFt7E68nw3YRZ5RcApBERHkZDHMDGMWx9uZjf6ADWf72ih6
Gas used: 20770
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 201
Created template with id '2'
Tx-Hash: th_2ibyU3DHxBtcqF38XALXTUsG5eNZJxGD6CLC2m5q9xcqNDRau4
Gas used: 9872
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 202
Minted NFT with id '2' of template with id '2'
Tx-Hash: th_245xbHsHAFCXAaKMnn6cyLRVacNajVq9firsCSdijS3Xjzoggj
Gas used: 21220
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 203
Minted NFT with id '3' of template with id '2'
Tx-Hash: th_2SNVzJjyncHA7hY5SpSc6CRCyaLjawbgJwnQsBaykbEsHH4mU1
Gas used: 21693
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 204
Created template with id '3'
Tx-Hash: th_96uaVRzGvGpc2cbUQ8Jcr6ZF5coDBZBxxCwmzkxPGFq769Y6u
Gas used: 9609
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 205
Minted NFT with id '4' of template with id '3'
Tx-Hash: th_2TwmoiVGCDRTKSye6kWLKXhYZizSHEfYo247yDwzVZn62CQ9EH
Gas used: 20889
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 206
Minted NFT with id '5' of template with id '3'
Tx-Hash: th_2FPyCeBQAtJ3FpWxQw2me2GPkWkUEE5nbBqb7bSzFU2dqoCcoD
Gas used: 20902
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 207
Minted NFT with id '6' of template with id '3'
Tx-Hash: th_2ReV7WX3umTEzvh5LhpXfNHpwxeictfFitZujoWhQ8hhjv4y3g
Gas used: 20915
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 208
Created template with id '4'
Tx-Hash: th_2SzeqZxAuWqzJrC8zPf2swFrrZEUHQMgzTm2Sw3CxdoWV6GkT8
Gas used: 9609
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 209
Minted NFT with id '7' of template with id '4'
Tx-Hash: th_Pf1H6FQD4YFTkcKZ5bjx5EHXv2ysNkTShDed9y7UYg8ANov6R
Gas used: 20928
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 210
Minted NFT with id '8' of template with id '4'
Tx-Hash: th_2Yvcw1NY3m8n3uJb5mSmsAbiq4TaZzdn1MUjQdEAhQaZtGZ7G7
Gas used: 20941
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 211
Minted NFT with id '9' of template with id '4'
Tx-Hash: th_t3GF7iTsuzSKCn89gVF6CUaNToiHkNuDRJhTozQb9YFNwz7Y8
Gas used: 20954
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 212
Minted NFT with id '10' of template with id '4'
Tx-Hash: th_2oFSqEXwnhw1TigGzgjTzFAXCYvHwf1vLsxeXcLxnkk8En1yrW
Gas used: 20967
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 213
Created template with id '5'
Tx-Hash: th_NnufVP31xmEGdT2pyfyc4mMkykCYBiicLprULeoC3w9VYgVxS
Gas used: 9609
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 214
Minted NFT with id '11' of template with id '5'
Tx-Hash: th_2Q5YV5knw9kJLiqHDKe7rf1D6ygFAVojvGA1AU9iMqWhVAQD3u
Gas used: 20980
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 215
Minted NFT with id '12' of template with id '5'
Tx-Hash: th_n99SJYSeKzT2bBkQizPR5pZmoWwCrtWG2AYGE17pQGhQrY8Z
Gas used: 20993
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 216
Minted NFT with id '13' of template with id '5'
Tx-Hash: th_2iq63GjKiQM55XL5kqHszMTQWxR1hV2z3QHW7mLVwwZmtMr9XD
Gas used: 21006
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 217
Minted NFT with id '14' of template with id '5'
Tx-Hash: th_iXszEPKHSHHymBXeCMgG4y2NRPFdZrn2JHNpvGiH2hLJNjQnL
Gas used: 21019
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 218
Minted NFT with id '15' of template with id '5'
Tx-Hash: th_2FMB4iuHbiEjgXhL3EKRZvpdvUB1WfDuCvRyCFgcNig3HrkxN7
Gas used: 21032
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 219
Created template with id '6'
Tx-Hash: th_jyHrAvmUs7LMEeZH7habmeyLRXtLV5GdNmTzALDdimTJPDT4r
Gas used: 9609
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 220
Minted NFT with id '16' of template with id '6'
Tx-Hash: th_2dc6gQgJcxh9o7j4ksKuQUKfjNyjTT9fz4BoxyKKsbnv5BuQde
Gas used: 21045
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 221
Minted NFT with id '17' of template with id '6'
Tx-Hash: th_2XEYCfuvXGnRDq7SNgkLJWzV6sTvkKiTK5iugdhtuGMnFNUckE
Gas used: 21058
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 222
Minted NFT with id '18' of template with id '6'
Tx-Hash: th_29P2dRZ61idjctCBPtM8328yQGDyby3J8r9JCLvG1ysYS2AYW4
Gas used: 21071
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 223
Minted NFT with id '19' of template with id '6'
Tx-Hash: th_2thhrzXq2uYxssbner5VroogZnJtNeYo4FGXGJDxbCSMst9Kfv
Gas used: 21084
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 224
Minted NFT with id '20' of template with id '6'
Tx-Hash: th_2NcGuSvUqDQAmZbr169WtpyGZZPbGPS1nKC8TQJWWAz3Yew8nw
Gas used: 21097
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 225
Minted NFT with id '21' of template with id '6'
Tx-Hash: th_mqqJN1A1ueXuwJa4HhnyQ8PHtRQXLBMAaZ1PRrfhorHYVxXXM
Gas used: 21110
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 226
Created template with id '7'
Tx-Hash: th_2SrJdSvPjV62RfeCMhFwepTDg6STGGw7jhFGjRnJw5DjthJEG5
Gas used: 9609
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 227
Minted NFT with id '22' of template with id '7'
Tx-Hash: th_u9UD81yVvHVDBfGFYVjCbMhVcyGJnEepM72FKDtfscnc2V3FB
Gas used: 21123
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 228
Minted NFT with id '23' of template with id '7'
Tx-Hash: th_VTZEenRKbjRwqgsZ1csRBgrNwwJ2HW55brgH1zzMs5UR57gJJ
Gas used: 21136
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 229
Minted NFT with id '24' of template with id '7'
Tx-Hash: th_S5bW3dX1EybdkSyXLLYW1j3qu36wu8M9McU7kmaxtxFf6yTCD
Gas used: 21149
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 230
Minted NFT with id '25' of template with id '7'
Tx-Hash: th_2anJr4Shv1va3oqSV4gqZRmiPZE9qDTMvHcC1wvtxfF8g38Q2k
Gas used: 21162
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 231
Minted NFT with id '26' of template with id '7'
Tx-Hash: th_kEwW3XKgTULVDHXMsoKa4Y7Kf5zDMECoYG7uPcrwv8zJFjpt2
Gas used: 21175
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 232
Minted NFT with id '27' of template with id '7'
Tx-Hash: th_y8TsVf2QdF5q5grC1GLzkRu6fWT1yHyHeLt6dbdG5VcWNFjsr
Gas used: 21188
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 233
Minted NFT with id '28' of template with id '7'
Tx-Hash: th_2bWNcpUHDf8FhcXW4bPPbxPHnKGnT9mAz2anrG77nv6hprndMB
Gas used: 21201
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 234
Created template with id '8'
Tx-Hash: th_2HvA2uikQtmZRPdpYqGkUEHvSDQYycpR9JC8XmC5a3UMrWBQUh
Gas used: 9609
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 235
Minted NFT with id '29' of template with id '8'
Tx-Hash: th_ZzPmumNtkYCfrGpVGtQP6em9hgkWQqstddB5ynagrJJa7ua9c
Gas used: 21214
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 236
Minted NFT with id '30' of template with id '8'
Tx-Hash: th_2UAUi3oYgcYsJ8EGvxR4vurygt7qhYq7tVRNx4g2sZ3quVpym7
Gas used: 21227
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 237
Minted NFT with id '31' of template with id '8'
Tx-Hash: th_JL2n2V5mo8g1JkK1MuFM5T3TGxFvJPNvx53eECq3FmziLM1Wf
Gas used: 21265
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 238
Minted NFT with id '32' of template with id '8'
Tx-Hash: th_28o9vXi8VThcBHVe3ptrkjpsewXXjDEQQfuFG6aAAoh13dbRvf
Gas used: 21280
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 239
Minted NFT with id '33' of template with id '8'
Tx-Hash: th_2bbWUsi5BoMFKezxwRKJUH5pvD5PmVco1PiQ4we4qPPviHF5m6
Gas used: 21293
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 240
Minted NFT with id '34' of template with id '8'
Tx-Hash: th_GeiXCxSo18NuFUzYhFBJ6qP9jNX9x9WPRAziSiM11RBNpdN6j
Gas used: 21306
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 241
Minted NFT with id '35' of template with id '8'
Tx-Hash: th_VJwCLbMYDtLC2hZNQkYL9ZBmWXxKeTzi6JShnVShfZDmLd89d
Gas used: 21319
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 242
Minted NFT with id '36' of template with id '8'
Tx-Hash: th_2iPCus1mjAiT5Vdm5qk6yD879Vi2xbzF7ub8ofpnhpxpA5cow2
Gas used: 21332
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
```
</details>

## Simple-NFT-Viewer

This repository also provides you an example frontend, the [Simple-NFT-Viewer](./simple-nft-viewer) which is written in Vue.js.

It fetches the NFT metadata from contract [ct_7UNRFTFazecMWA13WzZui6eqwbAit4WEApytasiGcNnWcfUwh](https://explorer.testnet.aeternity.io/contracts/transactions/ct_7UNRFTFazecMWA13WzZui6eqwbAit4WEApytasiGcNnWcfUwh) and displays:
 - Name of the NFT collection
 - Name, Description and Image of all NFTs

## Congratulations
Now you know everything to get started with minting your own and unique NFT collection on the æternity blockchain :-)