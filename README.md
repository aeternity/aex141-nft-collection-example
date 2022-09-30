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

The [deployAndMintCollectionTemplateEditionNFTs.js](./scripts/deployAndMintCollectionTemplateEditionNFTs.js) script demonstrates how you can use the SDK programmatically to deploy and mint your NFTs on the testnet. If you run the following command, the contract will be deployed, templates will be created and all the NFTs will be minted according to the data defined in [collection_templates.json](./nfts/collection_templates.json):

`SECRET_KEY=<your_secret_key> node ./scripts/deployAndMintCollectionTemplateEditionNFTs.js`

Alternatively you can set the env variable `SECRET_KEY` in your terminal and just run `node ./scripts/deployAndMintCollectionTemplateEditionNFTs.js`.

<details>
    <summary>Show console output</summary>

```sh
Deploying with account: ak_8Ujt76QfpT1DyYsNZKGPGtMZ2C2MFf7CcnpQvJWNsX6szZkYN
==> Adding include to filesystem: core/utils.aes
==> Adding include to filesystem: core/IAEX141NFTReceiver.aes
Contract successfully deployed!
Contract address: ct_2BETGLoeUzirwLgi1EzANDPKuokAgFSVFNMv6LsLAz71MAkR6T
Tx-Hash: th_2R4S1usjfhWsByT5aySKnJ5P9ggkMA9VydYP6rvLoZXkA6LWoQ
Gas used: 1260
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 37
Created template with id '1'
Tx-Hash: th_2NFRDPCNZXTH3xnRrBar7MFbXZnsKkmHnQV1bgi1ebsQP28c5f
Gas used: 9534
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 38
Minted NFT with id '1' of template with id '1'
Tx-Hash: th_oEsfy9bSsYrAGhjwWZwJzwrcoVDixvQAjRb8oMhAbnPNf95c7
Gas used: 20685
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 39
Created template with id '2'
Tx-Hash: th_2NmX2x4fH7yvdiL2K7aZQa4xpLvWiuw2mogx4dT2LrHjQiGCbz
Gas used: 9874
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 40
Minted NFT with id '2' of template with id '2'
Tx-Hash: th_2HFKJwgptVPdBzKu2LEqmMYGVJK6x5DCN7aU1UMBhu2wvHsm3N
Gas used: 21135
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 41
Minted NFT with id '3' of template with id '2'
Tx-Hash: th_2L5sTE6ThasKG1sc7zWLs6ZPFH2WbiMBGaLzbZCZeqyGWmSeyH
Gas used: 21608
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 42
Created template with id '3'
Tx-Hash: th_2MiqmiLmZhjJgyWntogJqu31Rbpxzmr7c38DDVemgHNRtrkf2u
Gas used: 9611
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 43
Minted NFT with id '4' of template with id '3'
Tx-Hash: th_2U9DXFvnF4MZGATKSR94g7MV9C3HwZZVmW3rHPcMF7rKHizncZ
Gas used: 20804
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 44
Minted NFT with id '5' of template with id '3'
Tx-Hash: th_LHhNu4pQxtWKYWXMvsTsvM9tA7hn3YnYnY5K9oCUZ9NG4AwcR
Gas used: 20817
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 45
Minted NFT with id '6' of template with id '3'
Tx-Hash: th_2gCmU8ELAVb9XCwVNsiPZ2H6cQSzb8YpLETm3F3pmeDeGY9pFf
Gas used: 20830
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 46
Created template with id '4'
Tx-Hash: th_22rUwgZ2YDyKADQRK8AvxqGp9vgUKReTZUctT2xozsMTYGaptE
Gas used: 9611
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 47
Minted NFT with id '7' of template with id '4'
Tx-Hash: th_ZWzzcBGH51ganmxN2M1VKSwGTDJrdtaKCKTHHx7wTpmhDBCgc
Gas used: 20843
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 48
Minted NFT with id '8' of template with id '4'
Tx-Hash: th_KDCUW13ZEccnEqo3PAmT4x1vs2sw9Gqbovw1mD78GMVefe7tL
Gas used: 20856
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 49
Minted NFT with id '9' of template with id '4'
Tx-Hash: th_9EijGeeUSCwBwoKj4TJWr5BVwCGWZQC8eAHYRmqsYeBRKG6AQ
Gas used: 20869
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 50
Minted NFT with id '10' of template with id '4'
Tx-Hash: th_2QHGWdKCBuffZXiaX2UdeavLHzMtC62pJB1djLcfGDXSQ77DTE
Gas used: 20882
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 51
Created template with id '5'
Tx-Hash: th_bdFsm1VYKBSUFECmjgdzj7bZ1QxjpZUvrMxUPa1WEkpc58wX4
Gas used: 9611
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 52
Minted NFT with id '11' of template with id '5'
Tx-Hash: th_GmExGsdbrXisHkrtmmhX2LWZ6txM9BbQgJUXKwd9yZqpN3XmY
Gas used: 20895
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 53
Minted NFT with id '12' of template with id '5'
Tx-Hash: th_1L8MEXJrD6RR2T6ByzvbG7QwVJoPzG1mw6NHRpQub9aLRch5c
Gas used: 20908
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 54
Minted NFT with id '13' of template with id '5'
Tx-Hash: th_kud5y3qpsKQirDH3juipF6BrtLiNr2RtSZtpaN3g7RSy3EDiG
Gas used: 20921
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 55
Minted NFT with id '14' of template with id '5'
Tx-Hash: th_LNgTxFCGwbyLzGzqcZviRxBCyv4oF1RqSmJG8Caxwoh7XNK7T
Gas used: 20934
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 56
Minted NFT with id '15' of template with id '5'
Tx-Hash: th_7XMEcdSYseorKnSx8HeqokDf2nwkEXpxyxfsw9Xxqw6VJJBqm
Gas used: 20947
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 57
Created template with id '6'
Tx-Hash: th_2EYEgSf4Zhw4aqXBHf1irzbzLL24sTGsKo5Mvbi3SvXGoufU6L
Gas used: 9611
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 58
Minted NFT with id '16' of template with id '6'
Tx-Hash: th_Dx4wFTfRtGvK3SuiwuG85seAoFRz8LrBKSmsRzhU7Hk5Tjbbf
Gas used: 20960
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 59
Minted NFT with id '17' of template with id '6'
Tx-Hash: th_2Hsd6uE1JSyHtSG4LPeAEB8gPV1MRnBjyq2QXp21DcnRaUeGQF
Gas used: 20973
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 60
Minted NFT with id '18' of template with id '6'
Tx-Hash: th_7kEndktrLDq2vVun6PU8Ds6PT1kgAVhDuyfD7DfNhxMjAbVbM
Gas used: 20986
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 61
Minted NFT with id '19' of template with id '6'
Tx-Hash: th_26fJKL1b4v3jNgg4eXABKmBpYY2hvofVccmbVKuvJjpzcTWRxY
Gas used: 20999
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 62
Minted NFT with id '20' of template with id '6'
Tx-Hash: th_2aEEJst49UTkxJNdG3deWhzd8pWQtZrTRTNx8K2GwfLX2C7T7T
Gas used: 21012
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 63
Minted NFT with id '21' of template with id '6'
Tx-Hash: th_2DqFXRgFWQrA2jWRK9NmbnnNqwwiRjJLJCnnsBje3VfiZ7nvAf
Gas used: 21025
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 64
Created template with id '7'
Tx-Hash: th_24PvB5R6gJ9s1spCCqf4guFcVwZfWNcmYaN94Qq5myS1r2dPgp
Gas used: 9611
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 65
Minted NFT with id '22' of template with id '7'
Tx-Hash: th_2Ku6ntkKRzE37rGTppDGEBAbd3kyTdq2KUnSteQef5kJSVD5Jx
Gas used: 21038
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 66
Minted NFT with id '23' of template with id '7'
Tx-Hash: th_2t1f82HoGWFitNSV4pZkgArv89ofnU6Cb15H4pTHsGJehi97Mf
Gas used: 21051
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 67
Minted NFT with id '24' of template with id '7'
Tx-Hash: th_ZsoNyCzzziTCybJLDrQskcURH5vS67utTH4hHTMvMt5ibBamj
Gas used: 21064
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 68
Minted NFT with id '25' of template with id '7'
Tx-Hash: th_2mrmB74UnhQX1gp2YJsgQLnmb8q7MXtQxhJZG12BQjk1yp4bwk
Gas used: 21077
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 69
Minted NFT with id '26' of template with id '7'
Tx-Hash: th_2sCkySYQYDxyYUTyE7Ck6Md7Ec6sZtnpgQmo6jFZqw8SspEk54
Gas used: 21090
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 70
Minted NFT with id '27' of template with id '7'
Tx-Hash: th_2v6X9xmEwRqwBdxAbXiBnLj49inNosuP2XPiZdkp2K9Wf5yUVA
Gas used: 21103
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 71
Minted NFT with id '28' of template with id '7'
Tx-Hash: th_2Y4XCvsNdCaEy9ax4iUM1gZSmfEAiTp86pzcqP72JqvvWnGiHH
Gas used: 21116
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 72
Created template with id '8'
Tx-Hash: th_2HjApkjR1yyKjMVsZHXDFAT2Ha3GTqHFnmH5EXXGGByK47jwxD
Gas used: 9611
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 73
Minted NFT with id '29' of template with id '8'
Tx-Hash: th_oh4r5DUKYfLVk5Q7GEQ1gHskZzygyX5zCNm68AkLwqAcg4avP
Gas used: 21129
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 74
Minted NFT with id '30' of template with id '8'
Tx-Hash: th_2jW3XEtd41oVT87CTD2WwZaFdJYxsHCQd5vARZgsiV2HBMRgsQ
Gas used: 21142
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 75
Minted NFT with id '31' of template with id '8'
Tx-Hash: th_258UYk1dXdDUTqQG62Z3VtW8WieavcBszicad5xjYAD8jUi8UQ
Gas used: 21180
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 76
Minted NFT with id '32' of template with id '8'
Tx-Hash: th_q1umh1vj31thtyGd817iRVPwK2S2neWjS5wXedCBZPzyE5Jnv
Gas used: 21195
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 77
Minted NFT with id '33' of template with id '8'
Tx-Hash: th_2CCETbFcEqJJxaes6DTjRyUP8dfbk95MHpdVqD2SQPMw7RN7gN
Gas used: 21208
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 78
Minted NFT with id '34' of template with id '8'
Tx-Hash: th_S7rgEYH5B7u49SUNRdAujy4Z82uBJcox8FSWYzdtBgwoMyWGW
Gas used: 21221
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 79
Minted NFT with id '35' of template with id '8'
Tx-Hash: th_2T4eGraLWRLJs87Y3oRBUYBuMP2ShXPDwweHbVVnggqehhTXxY
Gas used: 21234
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 80
Minted NFT with id '36' of template with id '8'
Tx-Hash: th_2YjHJ9i2qz62GoGDQ8Tc8GGYARxBwfPvmQDXQQXriycy3mbitH
Gas used: 21247
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
```
</details>

## Simple-NFT-Viewer (TODO -> update to new exmaples!!!)
**Note:** still using an old, outdated example to display the NFTs and doesn't work due to changes in the contracts

This repository also provides you an example frontend, the [Simple-NFT-Viewer](./simple-nft-viewer) which is written in Vue.js.

It fetches the NFT metadata from contract [ct_Fv9d66QTjr4yon9GEuMRc2B5y7Afy4to1ATaoYmpUTbN6DYiP](https://explorer.testnet.aeternity.io/contracts/transactions/ct_Fv9d66QTjr4yon9GEuMRc2B5y7Afy4to1ATaoYmpUTbN6DYiP) and displays:
 - Name of the NFT collection
 - Name, Description and Image of all NFTs

## Congratulations
Now you know everything to get started with minting your own and unique NFT collection on the æternity blockchain :-)