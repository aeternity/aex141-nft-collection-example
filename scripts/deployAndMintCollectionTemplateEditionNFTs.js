const { AeSdk, CompilerHttp, MemoryAccount, Node } = require('@aeternity/aepp-sdk');
const { utils } = require('@aeternity/aeproject');

const shutdown = (varName) => {
    console.error(`Missing ENV variable: ${varName}`);
    process.exit(1);
}

const NODE_URL = 'https://testnet.aeternity.io';
const COMPILER_URL = 'https://v7.compiler.aeternity.io';

const collectionTemplateEditionData = require('../nfts/collection_templates.json');

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

    const CONTRACT = './contracts/CollectionTemplateEditionNFTs.aes';
    const sourceCode = utils.getContractContent(CONTRACT);
    const fileSystem = utils.getFilesystem(CONTRACT);

    const contract = await aeSdk.initializeContract({ sourceCode, fileSystem });

    // deploy
    const deployment = await contract.init(
        collectionTemplateEditionData.name,
        collectionTemplateEditionData.symbol,
        8
    );
    console.log(`Contract successfully deployed!`);
    console.log(`Contract address: ${deployment.address}`);
    console.log(`Tx-Hash: ${deployment.transaction}`);
    console.log(`Gas used: ${deployment.result.gasUsed}`);
    console.log(`------------------------------------------------------------------------------------------`);
    console.log(`------------------------------------------------------------------------------------------`);

    // define nonce individually
    let nonce = (await aeSdk.api.getAccountNextNonce(senderAddress)).nextNonce
    // create templates and mint all nfts
    for(let i=0; i<collectionTemplateEditionData.templates.length; i++) {
        const createTemplateTx = await contract.create_template(
            {'MetadataIdentifier': [collectionTemplateEditionData.templates[i].immutable_metadata_url]},
            collectionTemplateEditionData.templates[i].edition_limit, { nonce });
        console.log(`Using nonce: ${nonce}`);
        console.log(`Created template with id '${createTemplateTx.decodedResult}'`);
        console.log(`Tx-Hash: ${createTemplateTx.hash}`);
        console.log(`Gas used: ${createTemplateTx.result.gasUsed}`);
        console.log(`------------------------------------------------------------------------------------------`);
        console.log(`------------------------------------------------------------------------------------------`);
        nonce++;
        // templates are defined with edition size 1,2,3,4,5,6,7,8 and all NFTs are minted at once
        for(let j=0; j<i+1; j++) {
            const templateMintTx = await contract.template_mint(senderAddress, i+1, undefined, { nonce });
            console.log(`Using nonce: ${nonce}`);
            console.log(`Minted NFT with id '${templateMintTx.decodedResult}' of template with id '${i+1}'`);
            console.log(`Tx-Hash: ${templateMintTx.hash}`);
            console.log(`Gas used: ${templateMintTx.result.gasUsed}`);
            console.log(`------------------------------------------------------------------------------------------`);
            console.log(`------------------------------------------------------------------------------------------`);
            nonce++;
        }
    }
})()
