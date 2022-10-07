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
- [CollectionUniqueNFTs.aes](./contracts/recommended/CollectionUniqueNFTs.aes)

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
- [CollectionTemplateEditionNFTs.aes](./contracts/recommended/CollectionTemplateEditionNFTs.aes)

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
==> Adding include to filesystem: ../core/utils.aes
==> Adding include to filesystem: ../core/IAEX141NFTReceiver.aes
Contract successfully deployed!
Contract address: ct_2uFHX2SYHSepCUUJ9QmDLxfKNDiLrgjbAdvZ2ZhJXVvc4YD1NL
Tx-Hash: th_ne9iG4oXdpgVXkyD2r85G9n5ZVRJX2zPQs8dxkFRxoPz7GHtU
Gas used: 1159
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 136
Minted NFT with id '1'
Tx-Hash: th_Gnh6fs8kgKKF9UaieKYt2uUiweMyn6vEBfZTdy86UdyTaCWE4
Gas used: 17614
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 137
Minted NFT with id '2'
Tx-Hash: th_zKiv98Qes4PdJvg1bfCJYVkjeBw8zrjRBPoK92tdS3obzEiYe
Gas used: 18304
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 138
Minted NFT with id '3'
Tx-Hash: th_2tEwhzJwkya3feQYt8B7bm8DK8LZVF3giXUi9byUkRGoBe8i9u
Gas used: 18076
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 139
Minted NFT with id '4'
Tx-Hash: th_2PtXHdoqymzYCWnDsfUDKddDxkEKRJLc7Q43rZzhC7Kvf5L35q
Gas used: 17706
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 140
Minted NFT with id '5'
Tx-Hash: th_qYJyKs8kC59ogQ5y8T9JfaiTe6DAuw7JGnhf17JGVFTBhiXxz
Gas used: 17719
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 141
Minted NFT with id '6'
Tx-Hash: th_2DYvgcJkebpGGV6ybXMwwQGjKafexvDXJomJ9bwkHqYau8drcS
Gas used: 17732
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 142
Minted NFT with id '7'
Tx-Hash: th_2g9zeC6gFmk38ugyt1guxLwmqWwPt98XSW6DAt9SZsqkJTQkGM
Gas used: 17745
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 143
Minted NFT with id '8'
Tx-Hash: th_KqsufM8XdV9LJZSxEYrc25hxcwzzjK17PFfX55v4nxguiXHCF
Gas used: 17758
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
==> Adding include to filesystem: ../core/utils.aes
==> Adding include to filesystem: ../core/IAEX141NFTReceiver.aes
Contract successfully deployed!
Contract address: ct_2H3AicCU5C52v5VFXtTdTVUSh8F2nehoJueJudWG2fhDdb5oVq
Tx-Hash: th_22LsrV2TRiJ8X2R4CpyCcGuyhv6VohAgeTadkgXcuenWPSYALf
Gas used: 1229
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 145
Created template with id '1'
Tx-Hash: th_2UhK7TABJ852EaQNVs52c6FkeZaPAv7FQDCq2yFSjt8QY6eC8F
Gas used: 9532
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 146
Minted NFT with id '1' of template with id '1'
Tx-Hash: th_2bUC2rgtrYCvvW43eceddsgxZC8Ue7ZA86ws6C8mXqSuRFPkZm
Gas used: 20694
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 147
Created template with id '2'
Tx-Hash: th_2TtcWwGQVjYCFdpdqpSNoMiNK2H1qJJbXRsnRa3i7xNpEWGwYt
Gas used: 9872
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 148
Minted NFT with id '2' of template with id '2'
Tx-Hash: th_2k9TSTcW9jwHa3tTqVA2HocXeb5bLoHcgdjF1e9yyxwpVACAM5
Gas used: 21144
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 149
Minted NFT with id '3' of template with id '2'
Tx-Hash: th_2UtzXD4yahr5Bs1CfRuzEKCqs5AakjiEL7C6RVx7CiK5n5mmUi
Gas used: 21617
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 150
Created template with id '3'
Tx-Hash: th_vggsp9ZvfsW5qSw4iLpiSKVRTNxE7vDiB6W1tKMeXYoyjGJfw
Gas used: 9609
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 151
Minted NFT with id '4' of template with id '3'
Tx-Hash: th_2QusZbzJcyNmTbmtGwPtShNY3bpBvseZfkz5ymY5u9wp9kkxbt
Gas used: 20813
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 152
Minted NFT with id '5' of template with id '3'
Tx-Hash: th_XGAQqiWoD2yGSnYLFRK8LPWRC4oZoJgM4SRRRvpM6BZ5n3mPF
Gas used: 20826
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 153
Minted NFT with id '6' of template with id '3'
Tx-Hash: th_2MBsXxdQ2553twkNM3F6WrQuYShguCynuXh5xtEJkHtmPCcsX6
Gas used: 20839
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 154
Created template with id '4'
Tx-Hash: th_2cBrFuziFpvzsf3667dfqcFbdFy4obQQHD2H8V48pUxSYLgZT8
Gas used: 9609
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 155
Minted NFT with id '7' of template with id '4'
Tx-Hash: th_g1vhgibgGe7RHg4SR69hagpBqgdFGY7wN7ca6zv9T4eogjcRs
Gas used: 20852
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 156
Minted NFT with id '8' of template with id '4'
Tx-Hash: th_qnAgJKNRTGZzuYvGp8pygDhG4WV6GJs5xqnrHNLEPB4sLSMzq
Gas used: 20865
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 157
Minted NFT with id '9' of template with id '4'
Tx-Hash: th_NDPpbiJSEWi4jfX7jmcFGtq42CnYv4YpWhUdgzrXAQ5rfhJL1
Gas used: 20878
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 158
Minted NFT with id '10' of template with id '4'
Tx-Hash: th_cQnuwe9iSzJEyBCixcxQVcsN8uVeKUEVShQ8M2HJTTSwv7Va
Gas used: 20891
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 159
Created template with id '5'
Tx-Hash: th_DqVP8TTGrqRMn37XSZf9nBaPbhvzraKdYmXowzktaVzCLFbpd
Gas used: 9609
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 160
Minted NFT with id '11' of template with id '5'
Tx-Hash: th_vD1eKXFAjoeQHMM5yg5T9dY2vm6DL5Z43WDKs3Ai6oPvWD8DX
Gas used: 20904
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 161
Minted NFT with id '12' of template with id '5'
Tx-Hash: th_DVsrdqsEaic1eQaFzahPBrgQ6nMWhGFKxohubT6PbgiSazm7M
Gas used: 20917
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 162
Minted NFT with id '13' of template with id '5'
Tx-Hash: th_FbdznA8fXXsZkscNoZ2PSpCNQqg2qtq3mTXP9SC1xRSVouabZ
Gas used: 20930
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 163
Minted NFT with id '14' of template with id '5'
Tx-Hash: th_2E8HRE2P83XMhmXJ3cDQpeHzbgd8gE9wTekSrw74G5kF2UqTQT
Gas used: 20943
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 164
Minted NFT with id '15' of template with id '5'
Tx-Hash: th_h863tyk8NmbYz1wUYZS8QQF4cYuKtgZq9oSKcVTotAj9GHRci
Gas used: 20956
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 165
Created template with id '6'
Tx-Hash: th_LhyvUFDqRyqwMk6weJ8dM3Jo2PFmPd4HfnnLHNim2EU7rG56Z
Gas used: 9609
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 166
Minted NFT with id '16' of template with id '6'
Tx-Hash: th_mq4SS4evawdzGJQQSUxxQiYt2BBup5VK2JarAtGLkZrhzHFXJ
Gas used: 20969
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 167
Minted NFT with id '17' of template with id '6'
Tx-Hash: th_2J2p8f7yB33RovLBqWe7gH98M9ANihx73t9aYRe7h5vnmmzyzA
Gas used: 20982
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 168
Minted NFT with id '18' of template with id '6'
Tx-Hash: th_KFpm84GC1RB3TnFLE9A94goLV6U1yWwr9UYbmajgnGTLoxNi1
Gas used: 20995
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 169
Minted NFT with id '19' of template with id '6'
Tx-Hash: th_2cieevU2USd4jz2BdyQAH34oNypge7HUWGWNUdPjnyNWeGL56a
Gas used: 21008
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 170
Minted NFT with id '20' of template with id '6'
Tx-Hash: th_egBYXMAxGbznzEmLomioZuNvmKNBePkGJZd8jyTxBgUkcJvoq
Gas used: 21021
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 171
Minted NFT with id '21' of template with id '6'
Tx-Hash: th_Mp1RtTvYimzMfwSyQBKXVQAaGSEc928sbBghKnX1gTjc3Pz14
Gas used: 21034
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 172
Created template with id '7'
Tx-Hash: th_S2eCAEfFvSySG7UwNY6UgQwys1G5KGDF6tUrAcRvTYcxgZkAn
Gas used: 9609
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 173
Minted NFT with id '22' of template with id '7'
Tx-Hash: th_2UUNGGyrPa3GViP2q3W9n7NX5Xp4czSox5BFw8ZcfwNwyVL5nD
Gas used: 21047
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 174
Minted NFT with id '23' of template with id '7'
Tx-Hash: th_2Xqqf9sweX6i1FJmLErbUi8ezQUswzK4W94VuQVePFGkBXGp2f
Gas used: 21060
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 175
Minted NFT with id '24' of template with id '7'
Tx-Hash: th_dGvyb54WSahZ42iissriW7Vrfo8CPSQ3DcpXmZEdxBSryS8Ms
Gas used: 21073
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 176
Minted NFT with id '25' of template with id '7'
Tx-Hash: th_zJBSQYN8oqmxAYxqCkaXpCGzxPsMExf8bJqw7DJ4hCKypH8xe
Gas used: 21086
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 177
Minted NFT with id '26' of template with id '7'
Tx-Hash: th_F6HPzUTijtduyU2Lcv5ixYKhz2vr33EPSkr3uDz4WZFcWd5Yz
Gas used: 21099
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 178
Minted NFT with id '27' of template with id '7'
Tx-Hash: th_gdNKphUiT58a7CAyiTY3gRcoCkHQvsvsfjZnmrvkoh1Bt5QDx
Gas used: 21112
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 179
Minted NFT with id '28' of template with id '7'
Tx-Hash: th_U9YGzeFnmPw27FDmRDbtWxkSHNZswqWjuwHpB9LWGzcSinCg1
Gas used: 21125
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 180
Created template with id '8'
Tx-Hash: th_2LzJXMXVrR2vVe257WHKAxhvp6rkJARxEziZE83cjx3ewMv2aW
Gas used: 9609
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 181
Minted NFT with id '29' of template with id '8'
Tx-Hash: th_2wCte9xTDdGACuTsNXq9jkUNfuypzKDhyBS74c8V9wSMfjCGpU
Gas used: 21138
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 182
Minted NFT with id '30' of template with id '8'
Tx-Hash: th_wc7SUynzRj6qA3nEAwGfJDB3Z6XEu8eywmXKxkaZQcu24Aabk
Gas used: 21151
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 183
Minted NFT with id '31' of template with id '8'
Tx-Hash: th_2pqomrWDC2AdaqZ9dm2U2CAm9g5MeZf5vstfY76GfiXPeXCVcU
Gas used: 21189
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 184
Minted NFT with id '32' of template with id '8'
Tx-Hash: th_6H27djF7SCghAHQ5ZA5dpPjV6iQ7DMVDSAus2EL19zCU44oVk
Gas used: 21204
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 185
Minted NFT with id '33' of template with id '8'
Tx-Hash: th_2SehZGYP974PTABs663QjbRVYBJo23kP32XcTZRcEieCRxNgbb
Gas used: 21217
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 186
Minted NFT with id '34' of template with id '8'
Tx-Hash: th_1EhRGxUXFGsSaFL9W3GaVHdhjccGvS912xDyQkyATH2cw9d6a
Gas used: 21230
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 187
Minted NFT with id '35' of template with id '8'
Tx-Hash: th_yHEU4n175kY3tdawVigBem1MLGtfiPzyHtrz5PjX3NTkzfZB9
Gas used: 21243
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 188
Minted NFT with id '36' of template with id '8'
Tx-Hash: th_2jGn723bBHqRESnDGeDQfp6HQEn5jYbL3e2joy3A5WW6hEaC4P
Gas used: 21256
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
```
</details>

## Simple-NFT-Viewer

This repository also provides you an example frontend, the [Simple-NFT-Viewer](./simple-nft-viewer) which is written in Vue.js.

It fetches the NFT metadata from contract [ct_2uFHX2SYHSepCUUJ9QmDLxfKNDiLrgjbAdvZ2ZhJXVvc4YD1NL](https://explorer.testnet.aeternity.io/contracts/transactions/ct_2uFHX2SYHSepCUUJ9QmDLxfKNDiLrgjbAdvZ2ZhJXVvc4YD1NL) and displays:
 - Name of the NFT collection
 - Name, Description and Image of all NFTs

## Congratulations
Now you know everything to get started with minting your own and unique NFT collection on the æternity blockchain :-)