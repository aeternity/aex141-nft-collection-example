const { assert, expect, use } = require('chai');
const { utils } = require('@aeternity/aeproject');
const chaiAsPromised = require('chai-as-promised');

use(chaiAsPromised);

const CONTRACT_SOURCE = './contracts/MintableMappedMetadataNFT.aes';
const RECEIVER_CONTRACT_SOURCE = './test/receiver.aes';

const collectionMetadata = require('../nfts/collection_metadata.json');

describe('MintableMappedMetadataNFT', () => {
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
  });

  describe('NFT collection', async () => {
    it('aex141_extensions', async () => {
      const { decodedResult } = await contract.methods.aex141_extensions();
      assert.deepEqual(decodedResult, ['mintable', 'mapped_metadata']);
    });
    it('meta_info', async () => {
      const { decodedResult } = await contract.methods.meta_info();
      assert.equal(decodedResult.name, collectionMetadata.name);
      assert.equal(decodedResult.symbol, collectionMetadata.symbol);
      assert.equal(decodedResult.metadata_type.MAP.length, 0);
      assert.equal(decodedResult.base_url, undefined);
    });
  });

  describe('NFT specific interactions', async () => {
    it('minting', async () => {
      const address = await accounts[0].address();

      // needed was we want to stringify objects defined in immutable_attributes and mutable_attributes
      const nftMetadataMapStringValues = new Array();

      // mint all nfts
      for(let i=0; i<collectionMetadata.nfts.length; i++) {
        nftMetadataMapStringValues[i] = new Map(Object.entries(collectionMetadata.nfts[i]).map(([k, v]) => [k, typeof v === 'object' ? JSON.stringify(v) : v]));
        const token = await contract.methods.mint(address, {'MetadataMap': [nftMetadataMapStringValues[i]]}, { onAccount: accounts[0] });
        assert.equal(token.decodedEvents[0].name, 'Transfer');
        assert.equal(token.decodedEvents[0].args[0].substring(2), contract.deployInfo.address.substring(2));
        assert.equal(token.decodedEvents[0].args[1], address);
        assert.equal(token.decodedEvents[0].args[2], i+1);
      }

      // check amount of NFTs of the owner / minter
      const nftBalance = await contract.methods.balance(address);
      assert.equal(nftBalance.decodedResult, 8);

      // expect metadata for NFT with id "0" to be not existent as we start counting with id "1"
      let nftMetadata = await contract.methods.metadata(0);
      assert.equal(nftMetadata.decodedResult, undefined);

      // expect metadata for NFT with id "1" to equal the metadata of the first minted NFT
      nftMetadata = await contract.methods.metadata(1);
      assert.deepEqual(nftMetadata.decodedResult.MetadataMap[0], nftMetadataMapStringValues[0]);

      // expect metadata for NFT with last id to equal the metadata of the last minted NFT
      nftMetadata = await contract.methods.metadata(collectionMetadata.nfts.length);
      assert.deepEqual(nftMetadata.decodedResult.MetadataMap[0], nftMetadataMapStringValues[collectionMetadata.nfts.length - 1]);
    });
    it('update mutable metadata', async () => {
      const current_mutable_attributes = '{"retries":0}';
      const updated_mutable_attributes = '{"retries":1}';
      const nftId = 1;
      // check current attributes
      let nftMetadata = await contract.methods.metadata(nftId);
      assert.equal(nftMetadata.decodedResult.MetadataMap[0].get('mutable_attributes'), current_mutable_attributes);

      // expect error when trying to update mutable attributes with other account than contract owner
      await expect(
        contract.methods.update_mutable_attributes(nftId, updated_mutable_attributes, { onAccount: accounts[1] }))
        .to.be.rejectedWith(`Invocation failed: "ONLY_CONTRACT_OWNER_CALL_ALLOWED`);

      // update mutable attributes
      await contract.methods.update_mutable_attributes(nftId, updated_mutable_attributes);

      // check updated attributes
      nftMetadata = await contract.methods.metadata(nftId);
      assert.equal(nftMetadata.decodedResult.MetadataMap[0].get('mutable_attributes'), updated_mutable_attributes);
    });
  });
});
