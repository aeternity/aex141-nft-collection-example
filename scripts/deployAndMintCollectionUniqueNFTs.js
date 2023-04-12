const { AeSdk, CompilerHttp, MemoryAccount, Node } = require('@aeternity/aepp-sdk');
const { utils } = require('@aeternity/aeproject');

const shutdown = (varName) => {
    console.error(`Missing ENV variable: ${varName}`);
    process.exit(1);
}

const NODE_URL = 'https://testnet.aeternity.io';
const COMPILER_URL = 'https://v7.compiler.aeternity.io';

const collectionUniqueMetadata = require('../nfts/collection_unique_nfts.json');

(async function () {
    secretKey = process.env.SECRET_KEY
    if(!secretKey) {
        shutdown('SECRET_KEY')
    }
    const senderAccount = new MemoryAccount(secretKey);
    const senderAddress = senderAccount.address;

    console.log(`Deploying with account: ${senderAddress}`);

    const node = new Node(NODE_URL);
    const aeSdk = new AeSdk({
        onCompiler: new CompilerHttp(COMPILER_URL),
        nodes: [{ name: 'testnet', instance: node }],
    });
    aeSdk.addAccount(senderAccount, { select: true });

    const CONTRACT = './contracts/CollectionUniqueNFTs.aes';
    const sourceCode = utils.getContractContent(CONTRACT);
    const fileSystem = utils.getFilesystem(CONTRACT);

    const contract = await aeSdk.initializeContract({ sourceCode, fileSystem });

    // deploy
    const deployment = await contract.init(
        collectionUniqueMetadata.name,
        collectionUniqueMetadata.symbol,
        8);
    console.log(`Contract successfully deployed!`);
    console.log(`Contract address: ${deployment.address}`);
    console.log(`Tx-Hash: ${deployment.transaction}`);
    console.log(`Gas used: ${deployment.result.gasUsed}`);
    console.log(`------------------------------------------------------------------------------------------`);
    console.log(`------------------------------------------------------------------------------------------`);

    const metadataMapAllNFTs = new Array();
    for(let i=0; i<collectionUniqueMetadata.immutable_metadata_urls.length; i++) {
      metadataMapAllNFTs.push(new Map([['url', collectionUniqueMetadata.immutable_metadata_urls[i]]]))
    }

    // define nonce individually
    let nonce = (await aeSdk.api.getAccountNextNonce(senderAddress)).nextNonce
    // mint all nfts
    for(let i=0; i<collectionUniqueMetadata.immutable_metadata_urls.length; i++) {
      const mintTx = await contract.mint(senderAddress, {'MetadataMap': [metadataMapAllNFTs[i]]}, undefined, { nonce });
      console.log(`Using nonce: ${nonce}`);
      console.log(`Minted NFT with id '${mintTx.decodedResult}'`);
      console.log(`Tx-Hash: ${mintTx.hash}`);
      console.log(`Gas used: ${mintTx.result.gasUsed}`);
      console.log(`------------------------------------------------------------------------------------------`);
      console.log(`------------------------------------------------------------------------------------------`);
      nonce++;
    }
})()
