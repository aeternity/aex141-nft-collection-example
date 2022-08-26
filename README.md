# aex141-nft-collection-example

This repository will guide you through all the steps required to create an NFT collection and mint unique NFTs on the æternity blockchain using the AEX-141 standard.

## Extensions

The example demonstrates the usage of following extensions:
- `mintable`

It is planned to introduce a new extension `mapped_metadata` which reflects this example and defines how to deal with collection specific metadata.

## Dealing with metadata

In the AEX-141 standard we aimed to be very flexible when it comes to dealing with metadata.

### Contract level: `meta_info`

The `meta_info` specifies general info about the NFT collection:

- `name` the name of the collection
- `symbol` the symbol of the collectio
- `base_url` the base-url, in case you want to use the metadata_type `URL` for the collection
    - this property is optional
- `metadata_type` the metadata type to use
    - one of `URL`, `IPFS`, `OBJECT_ID`, `MAP`

### Extension `mapped_metadata`
This example provides the first proposal how to deal with metadata for commonly known NFT collections and uses the metadata_type `MAP` specified in AEX-141. Following keys and possible values are proposed:

- `name` the name of the NFT
- `description` the description of the NFT
- `media_type` the media type of the NFT
    - e.g. `NONE`, `IMAGE`, `AUDIO`, `VIDEO`, `3D_GLB`, `PDF`, ... (every value is allowed right now, but ideally we define the best route to go based on discussions within the community)
- `media_url`
    - e.g. `ipfs://`, `ar://` (also not specified yet, but it might make sense to go this route)
    - we recommend to **AVOID** using centralized URLs as this property must be immutable
- `immutable_attributes`
    - a JSON string representing `map<string, object>` so that basically everything is possible to be represented here
    - these attributes are **immutable** and it should **NOT** be possible to change them
- `mutable_attributes` (not demonstrated in this example yet)
    - a JSON string representing `map<string, object>` so that basically everything is possible to be represented here
    - mutable attributes are especially interesting for game items, where you can for example collect experience points for the NFTs
    - of course any usecase is possible

## Example collection: Apes stepping into the MetaVerse

For this example we used [DALL-E 2](https://openai.com/dall-e-2) to generate some images based on the text `apes stepping into the metaverse`.

The images have been uploaded and pinned using [Pinata](https://www.pinata.cloud) where you can pin up to 1GB of media for free.

The NFT images of the example collection are stored under [nfts/images](./nfts/images) and their filename reflect the IPFS hash which is used in the `media_url` of each NFT ;-)

**Note**:

- When creating NFT collections you (or your community) should ensure that the media is always pinned on IPFS (or other decentralized storage alternatives) either by yourself or by some 3rd party service you typicall have to pay for.
- The good thing is that the IPFS hash will always be the same as long as somebody owning the original media has it stored somewhere, uploads and pins at again on IPFS.
- The bad news is that if the media isn't pinned anymore and nobody saved the original file the NFT media cannot be fetched anymore.

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

### Deploy & Mint :-)
The [deploy_and_mint.js](./scripts/deploy_and_mint.js) script demonstrates how you can use the SDK programmatically to deploy and mint your NFTs on the testnet. If you run the following command, the contract will be deployed and the NFTs will be minted according to the data defined in [collection_metadata.json](./nfts/collection_metadata.json):

`SECRET_KEY=<your_secret_key> node ./scripts/deploy_and_mint.js`

Alternatively you can set the env variable `SECRET_KEY` in your terminal and just run `node ./scripts/deploy_and_mint.js`.

The output then should look as follows:

```
Deploying with account: ak_QVSUoGrJ31CVxWpvgvwQ7PUPFgnvWQouUgsDBVoGjuT7hjQYW
==> Adding include to filesystem: core/utils.aes
==> Adding include to filesystem: core/IAEX141NFTReceiver.aes
Contract successfully deployed!
Contract address: ct_7oGmkvxzYXR2Pypvf5Pbj3x3VSmB8SwQgii1uScy9jAWWurL5
Tx-Hash: th_v3CpCeLGQ8rJhBhdrHoskVcYctBfEWU49r1HLNnHJdkq814MT
Gas used: 974
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Minted 'Walking on the ladder' with id '1'
Tx-Hash: th_2kjykNuExNMhcUK9m36ZipMNyphg8DXeCkJrYZgVVfGHqhJTWp
Gas used: 14600
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Minted 'The path to heaven' with id '2'
Tx-Hash: th_2nQLVADE27YHppRJoeQTXefMBrzQN4qqBNUan99JajNeLXS9WT
Gas used: 14721
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Minted 'Still sitting in the jungle' with id '3'
Tx-Hash: th_hPPTPnVA9hj6xeJAfifeRd4mMxxWjbu339rKAtcBBdrpzyFBr
Gas used: 15031
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Minted 'We almost made it!' with id '4'
Tx-Hash: th_AEQ6YqQHdZMKshC14au1RnXn5QJ3mi6hGX8aWzmGymav3g1ow
Gas used: 14656
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Minted 'I'm in!' with id '5'
Tx-Hash: th_CUSZLm2onzQWMZLgFHy5zLvJLon6nFYcJqmp5nGfaNzu7d1di
Gas used: 14653
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Minted 'Utopia is there!' with id '6'
Tx-Hash: th_GiwqeaTprH47181NQj8Nr3L49hU6XSnegyhkzr2Msi5cpcmbd
Gas used: 14826
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Minted 'Waiting for my homies!' with id '7'
Tx-Hash: th_ax6yxR66hZXALx72mT4k3qhwcqFYSMqdUERVTNEK2BawzQXXH
Gas used: 14956
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
Minted 'There is no way back!' with id '8'
Tx-Hash: th_B92Fx5SLVDAXA6RGLAtgDXxsdVzLHX8Zgw4nXY8WZoBA7M13Q
Gas used: 15043
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
```

## Simple-NFT-Viewer
This repository also provides you an example frontend, the [Simple-NFT-Viewer](./simple-nft-viewer) which is written in Vue.js.

It fetches the NFT metadata from contract [ct_7oGmkvxzYXR2Pypvf5Pbj3x3VSmB8SwQgii1uScy9jAWWurL5](https://explorer.testnet.aeternity.io/contracts/transactions/ct_7oGmkvxzYXR2Pypvf5Pbj3x3VSmB8SwQgii1uScy9jAWWurL5) and displays:
 - Name of the NFT collection
 - Name, Description and Image of all NFTs

## Congratulations
Now you know everything to get started with minting your own and unique NFT collection on the æternity blockhain :-)