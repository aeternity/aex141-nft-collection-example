const { assert } = require('chai');
const { utils } = require('@aeternity/aeproject');

const CONTRACT_SOURCE = './contracts/MintableMutableNFT.aes';
const RECEIVER_CONTRACT_SOURCE = './test/receiver.aes';

const collectionMetadata = require('../nfts/collection_metadata.json');

describe('MintableMutableNFT', () => {
  let aeSdk;
  let contract;
  let accounts;

  before(async () => {
    aeSdk = await utils.getSdk();
    accounts = utils.getDefaultAccounts();

    // a filesystem object must be passed to the compiler if the contract uses custom includes
    const fileSystem = utils.getFilesystem(CONTRACT_SOURCE);

    // get content of contract
    const source = utils.getContractContent(CONTRACT_SOURCE);

    // initialize the contract instance
    contract = await aeSdk.getContractInstance({ source, fileSystem });

    // deploy the contract
    await contract.deploy([
      collectionMetadata.name,
      collectionMetadata.symbol
    ]);

    // init and deploy receiver contract
    const receiver_contract_source = utils.getContractContent(RECEIVER_CONTRACT_SOURCE);
    receiver_contract = await aeSdk.getContractInstance({ source: receiver_contract_source });
    await receiver_contract.deploy();

    // create a snapshot of the blockchain state
    await utils.createSnapshot(aeSdk);
  });

  // after each test roll back to initial state
  afterEach(async () => {
    await utils.rollbackSnapshot(aeSdk);
  });

  it('NFT: aex141_extensions', async () => {
    const { decodedResult } = await contract.methods.aex141_extensions();
    assert.deepEqual(decodedResult, ['mintable']);
  });

  it('NFT: meta_info', async () => {
    const { decodedResult } = await contract.methods.meta_info();
    assert.equal(decodedResult.name, collectionMetadata.name);
    assert.equal(decodedResult.symbol, collectionMetadata.symbol);
    assert.equal(decodedResult.metadata_type.MAP.length, 0);
    assert.equal(decodedResult.base_url, undefined);
  });

  it('NFT: mint apes', async () => {
    const address = await accounts[0].address();
    // mint all nfts
    for(let i=0; i<collectionMetadata.nfts.length; i++) {
      const nftMetadataMapStringValues = new Map(Object.entries(collectionMetadata.nfts[i]).map(([k, v]) => [k, String(v)]));
      const token = await contract.methods.mint(address, {'MetadataMap': [nftMetadataMapStringValues]}, { onAccount: accounts[0] });
      assert.equal(token.decodedEvents[0].name, 'Transfer');
      assert.equal(token.decodedEvents[0].args[0].substring(2), contract.deployInfo.address.substring(2));
      assert.equal(token.decodedEvents[0].args[1], address);
      assert.equal(token.decodedEvents[0].args[2], i+1);
    }
    // check amount of NFTs of the owner / minter
    const nftBalance = await contract.methods.balance(address);
    assert.equal(nftBalance.decodedResult, collectionMetadata.nfts.length);
    // expect metadata for NFT with id "0" to be not existent as we start counting with id "1"
    let nftMetadata = await contract.methods.metadata(0);
    assert.equal(nftMetadata.decodedResult, undefined);
    // expect metadata for NFT with id "1" to equal the metadata of the first minted NFT
    nftMetadata = await contract.methods.metadata(1);
    assert.deepEqual(JSON.stringify(nftMetadata.decodedResult.MetadataMap[0]), JSON.stringify(jsonToMap(collectionMetadata.nfts[0])));
    // expect metadata for NFT with last id to equal the metadata of the last minted NFT
    const lastId = collectionMetadata.nfts.length - 1;
    nftMetadata = await contract.methods.metadata(lastId);
    assert.deepEqual(JSON.stringify(nftMetadata.decodedResult.MetadataMap[0]), JSON.stringify(jsonToMap(collectionMetadata.nfts[lastId])));
  });
});

function jsonToMap(nftMetadata) {
  return new Map(Object.entries(nftMetadata));
}