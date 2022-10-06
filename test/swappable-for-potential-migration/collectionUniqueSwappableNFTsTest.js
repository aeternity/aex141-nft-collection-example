const { assert, expect, use } = require('chai');
const { utils } = require('@aeternity/aeproject');
const chaiAsPromised = require('chai-as-promised');

use(chaiAsPromised);

const CONTRACT_SOURCE = './contracts/swappable-for-potential-migration/CollectionUniqueSwappableNFTs.aes';
const RECEIVER_CONTRACT_SOURCE = './test/receiver.aes';

const collectionUniqueMetadata = require('../../nfts/collection_unique_nfts.json');

const logGasUsed = (entrypoint, tx) => {
  console.log(`${entrypoint}, gas used: ${tx.result.gasUsed}`)
}

describe('CollectionUniqueSwappableNFTs', () => {
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
      collectionUniqueMetadata.name,
      collectionUniqueMetadata.symbol
    ]);

    // init and deploy receiver contract
    const receiver_contract_source = utils.getContractContent(RECEIVER_CONTRACT_SOURCE);
    receiver_contract = await aeSdk.getContractInstance({ source: receiver_contract_source });
    const deployTx = await receiver_contract.deploy();
    logGasUsed('init', deployTx);
  });

  describe('NFT collection', async () => {
    it('aex141_extensions', async () => {
      const { decodedResult } = await contract.methods.aex141_extensions();
      assert.deepEqual(decodedResult, ['mintable', 'burnable', 'swappable']);
    });
    it('meta_info', async () => {
      const { decodedResult } = await contract.methods.meta_info();
      assert.equal(decodedResult.name, collectionUniqueMetadata.name);
      assert.equal(decodedResult.symbol, collectionUniqueMetadata.symbol);
      assert.equal(decodedResult.metadata_type.MAP.length, 0);
      assert.equal(decodedResult.base_url, undefined);
    });
  });

  describe('NFT specific interactions', async () => {
    it('failed minting', async () => {
      const address = await accounts[0].address();
      await expect(
        contract.methods.mint(address, undefined, undefined, { onAccount: accounts[0] }))
        .to.be.rejectedWith(`Invocation failed: "NO_METADATA_PROVIDED"`);
      await expect(
        contract.methods.mint(address, {'MetadataIdentifier': ['fails anyway ...']}, undefined, { onAccount: accounts[0] }))
        .to.be.rejectedWith(`Invocation failed: "NOT_METADATA_MAP"`);
      await expect(
        contract.methods.mint(address, {'MetadataMap': [new Map()]}, undefined, { onAccount: accounts[1] }))
        .to.be.rejectedWith(`Invocation failed: "ONLY_CONTRACT_OWNER_CALL_ALLOWED"`);
    });
    
    it('minting', async () => {
      const address = await accounts[0].address();

      // check total supply before minting
      let totalSupply = await contract.methods.total_supply();
      assert.equal(totalSupply.decodedResult, 0)

      const metadataMapAllNFTs = new Array();
      for(let i=0; i<collectionUniqueMetadata.immutable_metadata_urls.length; i++) {
        metadataMapAllNFTs.push(new Map([['immutable_metadata_url', collectionUniqueMetadata.immutable_metadata_urls[i]]]))
      }

      // mint all nfts
      for(let i=0; i<collectionUniqueMetadata.immutable_metadata_urls.length; i++) {
        const mintTx = await contract.methods.mint(address, {'MetadataMap': [metadataMapAllNFTs[i]]}, undefined, { onAccount: accounts[0] });
        assert.equal(mintTx.decodedEvents[0].name, 'Mint');
        assert.equal(mintTx.decodedEvents[0].args[0], address);
        assert.equal(mintTx.decodedEvents[0].args[1], i+1);
        logGasUsed('mint', mintTx);
      }

      // check total supply after minting
      totalSupplyDryRun = await contract.methods.total_supply();
      assert.equal(totalSupplyDryRun.decodedResult, 8)

      // check amount of NFTs of the owner / minter
      const balanceDryRun = await contract.methods.balance(address);
      assert.equal(balanceDryRun.decodedResult, 8);

      // check NFT ids of the owner / minter
      const getOwnedTokensDryRun = await contract.methods.get_owned_tokens(address);
      assert.deepEqual(getOwnedTokensDryRun.decodedResult, [1n,2n,3n,4n,5n,6n,7n,8n]);

      // expect metadata for NFT with id "0" to be not existent as we start counting with id "1"
      let metadataDryRun = await contract.methods.metadata(0);
      assert.equal(metadataDryRun.decodedResult, undefined);

      // expect metadata for NFT with id "1" to equal the metadata of the first minted NFT
      metadataDryRun = await contract.methods.metadata(1);
      assert.deepEqual(metadataDryRun.decodedResult.MetadataMap[0], metadataMapAllNFTs[0]);

      // expect metadata for NFT with last id to equal the metadata of the last minted NFT
      metadataDryRun = await contract.methods.metadata(metadataMapAllNFTs.length);
      assert.deepEqual(metadataDryRun.decodedResult.MetadataMap[0], metadataMapAllNFTs[metadataMapAllNFTs.length - 1]);
    });

    it('transfer', async () => {
      // expect failed transfer
      const from = await accounts[0].address();
      await expect(
        contract.methods.transfer(from, 8, { onAccount: accounts[0] }))
        .to.be.rejectedWith(`Invocation failed: "SENDER_MUST_NOT_BE_RECEIVER"`);
      
      // expect successful transfer
      const to = await accounts[1].address();
      const transferTx = await contract.methods.transfer(to, 8, { onAccount: accounts[0] });
      assert.equal(transferTx.decodedEvents[0].name, 'Transfer');
      assert.equal(transferTx.decodedEvents[0].args[0], from);
      assert.equal(transferTx.decodedEvents[0].args[1], to);
      assert.equal(transferTx.decodedEvents[0].args[2], 8);
      logGasUsed('transfer', transferTx);

      // check balances after transfer
      let balanceDryRun = await contract.methods.balance(from);
      assert.equal(balanceDryRun.decodedResult, 7);
      balanceDryRun = await contract.methods.balance(to);
      assert.equal(balanceDryRun.decodedResult, 1);

      // check owned NFTs after transfer
      let getOwnedTokensDryRun = await contract.methods.get_owned_tokens(from);
      assert.deepEqual(getOwnedTokensDryRun.decodedResult, [1n,2n,3n,4n,5n,6n,7n]);
      getOwnedTokensDryRun = await contract.methods.get_owned_tokens(to);
      assert.deepEqual(getOwnedTokensDryRun.decodedResult, [8n]);
    });

    it('failed burn', async () => {
      await expect(
        contract.methods.burn(10, { onAccount: accounts[0] }))
        .to.be.rejectedWith(`Invocation failed: "TOKEN_NOT_EXISTS"`);
      await expect(
        contract.methods.burn(1, { onAccount: accounts[1] }))
        .to.be.rejectedWith(`Invocation failed: "ONLY_OWNER_APPROVED_OR_OPERATOR_CALL_ALLOWED"`);
    });

    it('burn', async () => {
      // burn
      let burnTx = await contract.methods.burn(1, { onAccount: accounts[0] });
      assert.equal(burnTx.decodedEvents[0].name, 'Burn');
      assert.equal(burnTx.decodedEvents[0].args[0], await accounts[0].address());
      assert.equal(burnTx.decodedEvents[0].args[1], 1);
      logGasUsed('burn', burnTx);

      // burn again
      burnTx = await contract.methods.burn(8, { onAccount: accounts[1] });
      assert.equal(burnTx.decodedEvents[0].name, 'Burn');
      assert.equal(burnTx.decodedEvents[0].args[0], await accounts[1].address());
      assert.equal(burnTx.decodedEvents[0].args[1], 8);
      logGasUsed('burn', burnTx);

      // check balances after burn
      let balanceDryRun = await contract.methods.balance(await accounts[0].address());
      assert.equal(balanceDryRun.decodedResult, 6);
      balanceDryRun = await contract.methods.balance(await accounts[1].address());
      assert.equal(balanceDryRun.decodedResult, 0);

      // check owned NFTs after transfer
      let getOwnedTokensDryRun = await contract.methods.get_owned_tokens(await accounts[0].address());
      assert.deepEqual(getOwnedTokensDryRun.decodedResult, [2n,3n,4n,5n,6n,7n]);
      getOwnedTokensDryRun = await contract.methods.get_owned_tokens(await accounts[1].address());
      assert.deepEqual(getOwnedTokensDryRun.decodedResult, []);

      // check total supply after burn
      const totalSupplyDryRun = await contract.methods.total_supply();
      assert.equal(totalSupplyDryRun.decodedResult, 6);
    });

    it('failed swap', async () => {
      await expect(
        contract.methods.swap({ onAccount: accounts[1] }))
        .to.be.rejectedWith(`Invocation failed: "NOTHING_TO_SWAP"`);
      await expect(
        contract.methods.swap({ onAccount: accounts[2] }))
        .to.be.rejectedWith(`Invocation failed: "NOTHING_TO_SWAP"`);
    });

    it('swap', async () => {
      // swap
      const swapTx = await contract.methods.swap({ onAccount: accounts[0] });
      assert.equal(swapTx.decodedEvents.length, 6);
      const toSwap = new Set([2n,3n,4n,5n,6n,7n]);
      for(let i=0; i<6; i++) {
        assert.equal(swapTx.decodedEvents[i].name, 'Swap');
        assert.equal(swapTx.decodedEvents[i].args[0], await accounts[0].address());
        assert.isTrue(toSwap.has(swapTx.decodedEvents[i].args[1]));
      }
      logGasUsed('swap', swapTx);

      // check balance after swap
      let balanceDryRun = await contract.methods.balance(await accounts[0].address());
      assert.equal(balanceDryRun.decodedResult, 0);

      // check_swap for account
      const checkSwapDryRun = await contract.methods.check_swap(await accounts[0].address());
      assert.deepEqual(checkSwapDryRun.decodedResult, [2n,3n,4n,5n,6n,7n]);

      // check swapped
      const swappedDryRun = await contract.methods.swapped();
      assert.deepEqual(swappedDryRun.decodedResult, new Map([[await accounts[0].address(), new Set([2n,3n,4n,5n,6n,7n])]]));

      // check total supply after swap
      const totalSupply = await contract.methods.total_supply();
      assert.equal(totalSupply.decodedResult, 0);
    });
  });
});
