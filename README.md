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
Contract address: ct_2kq7uvjCdgxx4YMfYzJTD2pc7UcMTTp2warjKjkcWFBtS9XFvh
Tx-Hash: th_UPapfMRtEmw1RKc8WoitTFASYANnadrsRz8SkcW8wfC15oGb5
Gas used: 1190
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 82
Minted NFT with id '1'
Tx-Hash: th_Bawi9PgtSU2z6dHi1HEHpVY3qLN4g1JTCLqFeoYaYMMQX5gFz
Gas used: 17616
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 83
Minted NFT with id '2'
Tx-Hash: th_23wDBGkkXQvk9oQh26dx2W2WjH48xo18MeudLjCAULRXZSWi2R
Gas used: 18306
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 84
Minted NFT with id '3'
Tx-Hash: th_hqaH2E3eWycokbrRr1fmf2XcAxAKDEg2cBgpd2mffd5XQpFr1
Gas used: 18078
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 85
Minted NFT with id '4'
Tx-Hash: th_2eRGfBpfnBurgaiqUxRnH6g5UVe6yohZnHvoz7eQ2V3Y6bkXn5
Gas used: 17708
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 86
Minted NFT with id '5'
Tx-Hash: th_26wjtdyrJidsGdcCrHMDZGGHZX3b3ec1vfXyLjHNTJEs93YkiY
Gas used: 17721
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 87
Minted NFT with id '6'
Tx-Hash: th_gqGTcKUeSmFw9RfFDccLYUeYdeSPLTjEg63oZLWUMZgHwa4DM
Gas used: 17734
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 88
Minted NFT with id '7'
Tx-Hash: th_2qYSiD1cKvWPcRMmuJwExWYouBmFSNCihnBtWenu6KNsPPodpW
Gas used: 17747
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 89
Minted NFT with id '8'
Tx-Hash: th_4TSYtomERaLyUSkxirNNJU46aqTaWEW4JjjQqtS89y6XDDTgU
Gas used: 17760
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
Contract address: ct_pMb4zUYoaaiwAevPYWdEreURqTk8JVCRfCJo8ysZZXw5rbvPF
Tx-Hash: th_2G6L85ndi1BCyv7Rz2R8oDzL5v9o9Fcq3wvUCfifhxf9DYjmXz
Gas used: 1260
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 91
Created template with id '1'
Tx-Hash: th_2XPzSAQfPkF7cKgQLoJsNL4vg9YLNCaQnkLqkdvsDZXHtdM7ZL
Gas used: 9534
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 92
Minted NFT with id '1' of template with id '1'
Tx-Hash: th_2d2MzmQajxVzbXH56iUiq9jKjfJ9BJpM4nugBCY18BWeYE7ZxJ
Gas used: 20696
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 93
Created template with id '2'
Tx-Hash: th_2RfVKDF7hKqicXRn5buQTsroxFk65Rndsdh53hD5M5LYvvnWnm
Gas used: 9874
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 94
Minted NFT with id '2' of template with id '2'
Tx-Hash: th_mwUTpmBYiVFp6gdKta6iNwkmLujhGaH5orC9wqTzsyWbw9TTH
Gas used: 21146
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 95
Minted NFT with id '3' of template with id '2'
Tx-Hash: th_anM5SCnLtWTizRHjvS6h87gD7cX9KF3veQ2d6PQm71HbQP2Di
Gas used: 21619
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 96
Created template with id '3'
Tx-Hash: th_2BF5Acx7UkHenTYFXN3sywRxE7fAwDJZ1e2yQREs2rhmbmabHf
Gas used: 9611
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 97
Minted NFT with id '4' of template with id '3'
Tx-Hash: th_21S8FVEpDEPYnpsenA187PR3B7yojHFWSj3RGHgvXRrUXhs9Ds
Gas used: 20815
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 98
Minted NFT with id '5' of template with id '3'
Tx-Hash: th_YQ1Kpjs9ebCvnhKAcnMwHtFbMR13xkz8DUT3UWuDjoroWKrpa
Gas used: 20828
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 99
Minted NFT with id '6' of template with id '3'
Tx-Hash: th_2brYnE8oGjZ8mENek4z5FVnsxRkwk4PbNaZw9kv1nKaUxvN7vf
Gas used: 20841
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 100
Created template with id '4'
Tx-Hash: th_94Tz6BahJ8TmeJNNMJSybwedVmREGyi6Y4gxnPJQZY8ZEu1We
Gas used: 9611
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 101
Minted NFT with id '7' of template with id '4'
Tx-Hash: th_GZzU3cjm1E9g1fs9KKVyfYjgfFVwTJHipXrwNAiiE63e3AWhr
Gas used: 20854
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 102
Minted NFT with id '8' of template with id '4'
Tx-Hash: th_2aNBfp6TL2idpgdtDXnEUvAtd9QzqY7K6rFLeRCc1Pgmq7z5DW
Gas used: 20867
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 103
Minted NFT with id '9' of template with id '4'
Tx-Hash: th_2bis2VoWaVoZ7sAdTEgUD2e1L9qZtvi4CueSFmeRYPYKCMvaZ6
Gas used: 20880
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 104
Minted NFT with id '10' of template with id '4'
Tx-Hash: th_FxRoattUCktuXzgar3FiqMhufVN9dPKCSRTg3rSqd7SUYbJSb
Gas used: 20893
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 105
Created template with id '5'
Tx-Hash: th_H3XXpBJzQ8CiynGeX8hFYTVkAfATBzCDtSgXnwUmm7Ya3JAXY
Gas used: 9611
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 106
Minted NFT with id '11' of template with id '5'
Tx-Hash: th_GGAnmtiHGhVYCpcesq4a7FwvTG295i4Meuw3A9Si8qK8kXyXh
Gas used: 20906
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 107
Minted NFT with id '12' of template with id '5'
Tx-Hash: th_2vTi1CuwLSNuSvmAFDhBmEpViH823oQfY897fhH9oMC5nDJjQM
Gas used: 20919
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 108
Minted NFT with id '13' of template with id '5'
Tx-Hash: th_2DsDjjwLseRWGyogTUTzNhpV9AWtjJ4AXDLbFmY5ZCczRgQJkq
Gas used: 20932
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 109
Minted NFT with id '14' of template with id '5'
Tx-Hash: th_2DdNopa6qehJrqQ11ADbJg6fuZbQTuQuLZ6wNsQQC4T3PgekH5
Gas used: 20945
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 110
Minted NFT with id '15' of template with id '5'
Tx-Hash: th_2vDm1Fu8zSxSiy7emRXqd6vXzT1xGjKwHjpiWsyr3RyMZ3GgAu
Gas used: 20958
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 111
Created template with id '6'
Tx-Hash: th_VpWMkZNFBDVRxHRBK2ANApp31WL2mdQCrsiS8ZPyGbvYZrAdg
Gas used: 9611
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 112
Minted NFT with id '16' of template with id '6'
Tx-Hash: th_SPBxjKhTcRfmCQaozmNHwvSNCQufy8r7YkyPtbS1ezz6qGg2b
Gas used: 20971
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 113
Minted NFT with id '17' of template with id '6'
Tx-Hash: th_2fMmfQ2gbZ5YwwPmL8o7sEphycAPuX3ibDC1MUf2ckhWXuhWR6
Gas used: 20984
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 114
Minted NFT with id '18' of template with id '6'
Tx-Hash: th_211CozJkEoqkLPKYFRVMJWM8J2phrdAnuinz2NMBqa1FRNyN2E
Gas used: 20997
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 115
Minted NFT with id '19' of template with id '6'
Tx-Hash: th_Pe6zCVFXy695wv1wyey1WB7QQJTNYxM8KzuSMYt45WXS9fpPV
Gas used: 21010
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 116
Minted NFT with id '20' of template with id '6'
Tx-Hash: th_tWfBEiqmMyq1VJMWVcNJSwSHkyPp1yWWQ9ZyFicUcjEZga7V4
Gas used: 21023
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 117
Minted NFT with id '21' of template with id '6'
Tx-Hash: th_2hz1AnqgRoVG8bh6zi5tfR8hqCBRyryC1UfXXtvGVJhi96x6M9
Gas used: 21036
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 118
Created template with id '7'
Tx-Hash: th_2AhPLaAtgkS567WqiNHBAkWgwTGurcRbZc586oym9bz1hJa3Lx
Gas used: 9611
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 119
Minted NFT with id '22' of template with id '7'
Tx-Hash: th_2ZZ57M9YFTGqohAVrQy3vbBrWkhAiaBhyR5hXcX2m55vVoMPj
Gas used: 21049
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 120
Minted NFT with id '23' of template with id '7'
Tx-Hash: th_J2H5UspSi549Vyp84oqQvoy59ZuVqe6epjsCzefQrtM1A1KUF
Gas used: 21062
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 121
Minted NFT with id '24' of template with id '7'
Tx-Hash: th_E8ZCopJh9Ltfz9TLBN8iahQ3Zk4MRjUGsvvoUabyyCwQvepnE
Gas used: 21075
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 122
Minted NFT with id '25' of template with id '7'
Tx-Hash: th_bzn35YgWuPcXkyQXpjA3Mp9XVC5AvEiZ9EY6YhJhnkfjhZ45o
Gas used: 21088
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 123
Minted NFT with id '26' of template with id '7'
Tx-Hash: th_22eokAJrJS52H3SiZyV4axhedrMQuPRBCHvomxCzCip7MwNWDv
Gas used: 21101
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 124
Minted NFT with id '27' of template with id '7'
Tx-Hash: th_2KkYmRQinxzFeNCjQDm85USoDJQxJFUWbdTxCV91iEdwnJB2No
Gas used: 21114
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 125
Minted NFT with id '28' of template with id '7'
Tx-Hash: th_2Vjg2tT2vtiAp142QiMUCnXBPWVQk4C4tjYdpHwdhiKMXMzp39
Gas used: 21127
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 126
Created template with id '8'
Tx-Hash: th_2NgX9ARwxdMxpJm9vQ3aht6Gn8ETSoSm96qCyxV91AkEiw1icy
Gas used: 9611
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 127
Minted NFT with id '29' of template with id '8'
Tx-Hash: th_nuqwrjdB74dPz7eB7ZdsAbUJg6NV8ktd6s2hjF41w2WzvrSNM
Gas used: 21140
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 128
Minted NFT with id '30' of template with id '8'
Tx-Hash: th_2SftqpDd2bm1b9u3ZxraQWTzKy3Epbf4X6KtTR5FzQXxjzSXvJ
Gas used: 21153
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 129
Minted NFT with id '31' of template with id '8'
Tx-Hash: th_gZ5DTQjTzB7YDpcVre3APb6DxZNT3B2a3F5HitLM9hRJcDgxw
Gas used: 21191
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 130
Minted NFT with id '32' of template with id '8'
Tx-Hash: th_rUzCZdBT19QkD6u2PEstsPs3ZBnzWqzjP8Zb39ruKzmTgRGwY
Gas used: 21206
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 131
Minted NFT with id '33' of template with id '8'
Tx-Hash: th_gKiqMaut6AzZGm5Ue9PNYphovrbxTrbQn86BoczzvBMUmoHtp
Gas used: 21219
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 132
Minted NFT with id '34' of template with id '8'
Tx-Hash: th_6AbB4H1q8XRBYbKpqxP5Eb1ELd4PSz5y6qpZFsPk17tCvKUt9
Gas used: 21232
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 133
Minted NFT with id '35' of template with id '8'
Tx-Hash: th_2CaPLUGDidy4VZ8EB9pY32jG6Q96ciPh6hX1zmWfnLkqZ1CigH
Gas used: 21245
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Using nonce: 134
Minted NFT with id '36' of template with id '8'
Tx-Hash: th_Qu1TwqFtM787GnCydNq1kK5MonhhwA3y1NXF1BncJDoRpdjd1
Gas used: 21258
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