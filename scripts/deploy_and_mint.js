const { AeSdk, MemoryAccount, Node, getAddressFromPriv} = require('@aeternity/aepp-sdk');
const { utils } = require('@aeternity/aeproject');

const shutdown = (varName) => {
    console.error(`Missing ENV variable: ${varName}`);
    process.exit(1);
}

const NODE_URL = 'https://testnet.aeternity.io';
const COMPILER_URL = 'https://compiler.aeternity.io';

const collectionMetadata = require('../nfts/collection_metadata.json');

(async function () {
    secretKey = process.env.SECRET_KEY
    if(!secretKey) {
        shutdown('SECRET_KEY')
    }
    const senderAccount = new MemoryAccount({
        keypair: {
            secretKey,
            publicKey: getAddressFromPriv(secretKey)
        }
    });
    const senderAddress = await senderAccount.address();

    console.log(`Deploying with account: ${senderAddress}`);

    const node = new Node(NODE_URL);
    const aeSdk = new AeSdk({
        compilerUrl: COMPILER_URL,
        nodes: [{ name: 'testnet', instance: node }],
    });
    await aeSdk.addAccount(senderAccount, { select: true });

    const CONTRACT = './contracts/MintableMappedMetadataNFT.aes';
    const source = utils.getContractContent(CONTRACT);
    const fileSystem = utils.getFilesystem(CONTRACT);

    const contract = await aeSdk.getContractInstance({ source, fileSystem });

    // deploy
    await contract.deploy([
        collectionMetadata.name,
        collectionMetadata.symbol
    ]);
    console.log(`Contract successfully deployed!`);
    console.log(`Contract address: ${contract.deployInfo.address}`);
    console.log(`Tx-Hash: ${contract.deployInfo.txData.hash}`);
    console.log(`Gas used: ${contract.deployInfo.result.gasUsed}`);
    console.log(`------------------------------------------------------------------------------------------`);
    console.log(`------------------------------------------------------------------------------------------`);

    // mint
    for(let i=0; i<collectionMetadata.nfts.length; i++) {
        const nftMetadataMapStringValues = new Map(Object.entries(collectionMetadata.nfts[i]).map(([k, v]) => [k, typeof v === 'object' ? JSON.stringify(v) : v]));
        const tx = await contract.methods.mint(
            senderAddress,
            {'MetadataMap': [nftMetadataMapStringValues]}
        );
        console.log(`Minted '${nftMetadataMapStringValues.get('name')}' with id '${tx.decodedResult}'`);
        console.log(`Tx-Hash: ${tx.hash}`);
        console.log(`Gas used: ${tx.result.gasUsed}`);
        console.log(`------------------------------------------------------------------------------------------`);
        console.log(`------------------------------------------------------------------------------------------`);
    };
})()
