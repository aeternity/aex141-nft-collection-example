const { assert, expect, use } = require('chai');
const { utils } = require('@aeternity/aeproject');
const chaiAsPromised = require('chai-as-promised');

use(chaiAsPromised);

const CONTRACT_SOURCE = './contracts/recommended/CollectionTemplateEditionNFTs.aes';
const RECEIVER_CONTRACT_SOURCE = './contracts/nft-receiver-example/AEX141NFTReceiverExample.aes';

const collectionTemplateData = require('../../nfts/collection_templates.json');

const logGasUsed = (entrypoint, tx) => {
  console.log(`${entrypoint}, gas used: ${tx.result.gasUsed}`)
}

describe('CollectionTemplateEditionNFTs', () => {
  let aeSdk;
  let contract;
  let accounts;

  let totalMintCount = 0;
  let allTokensToBeMinted = [];

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
      collectionTemplateData.name,
      collectionTemplateData.symbol
    ]);

    // init and deploy receiver contract
    const receiver_contract_source = utils.getContractContent(RECEIVER_CONTRACT_SOURCE);
    receiver_contract = await aeSdk.getContractInstance({ source: receiver_contract_source, fileSystem: utils.getFilesystem(RECEIVER_CONTRACT_SOURCE) });
    await receiver_contract.deploy();
  });

  describe('NFT collection', async () => {
    it('aex141_extensions', async () => {
      const { decodedResult } = await contract.methods.aex141_extensions();
      assert.deepEqual(decodedResult, ['mintable_templates', 'mutable_attributes', 'burnable']);
    });
    it('meta_info', async () => {
      const { decodedResult } = await contract.methods.meta_info();
      assert.equal(decodedResult.name, collectionTemplateData.name);
      assert.equal(decodedResult.symbol, collectionTemplateData.symbol);
      assert.equal(decodedResult.metadata_type.MAP.length, 0);
      assert.equal(decodedResult.base_url, undefined);
    });
  });

  describe('Template Creation', async () => {
    it('failed template creation', async () => {;
      await expect(
        contract.methods.create_template("ipfs://...", 0, { onAccount: accounts[0] }))
        .to.be.rejectedWith(`Invocation failed: "EDITION_SIZE_MUST_BE_AT_LEAST_ONE"`);
      await expect(
        contract.methods.create_template("ipfs://...", 0, { onAccount: accounts[1] }))
        .to.be.rejectedWith(`Invocation failed: "ONLY_CONTRACT_OWNER_CALL_ALLOWED"`);
    });

    it('template creation', async () => {;
      for(let i=0; i<collectionTemplateData.templates.length; i++) {
        const createTemplateTx =
          await contract.methods.create_template(
            collectionTemplateData.templates[i].immutable_metadata_url,
            collectionTemplateData.templates[i].edition_size, { onAccount: accounts[0] });
        assert.equal(createTemplateTx.decodedResult, i+1);
        assert.equal(createTemplateTx.decodedEvents[0].name, 'TemplateCreated');
        assert.equal(createTemplateTx.decodedEvents[0].args[0], i+1);
        assert.equal(createTemplateTx.decodedEvents[0].args[1], collectionTemplateData.templates[i].immutable_metadata_url);
        assert.equal(createTemplateTx.decodedEvents[0].args[2], collectionTemplateData.templates[i].edition_size);
        logGasUsed('create_template', createTemplateTx);
      }
      
      // check template
      let dryRunTemplate = await contract.methods.template(0);
      assert.equal(dryRunTemplate.decodedResult, undefined);

      for(let i=0; i<collectionTemplateData.templates.length; i++) {
        dryRunTemplate = await contract.methods.template(i+1);
        let expectedTemplate = {
          immutable_metadata_url: collectionTemplateData.templates[i].immutable_metadata_url,
          edition_size: BigInt(collectionTemplateData.templates[i].edition_size),
          edition_mint_count: BigInt(0)
        }
        assert.deepEqual(dryRunTemplate.decodedResult, expectedTemplate);
      }
    });
  });

  describe('NFT specific interactions', async () => {
    it('failed minting - basic check', async () => {
      const address = await accounts[0].address();
      await expect(
        contract.methods.template_mint(address, 0, undefined, { onAccount: accounts[0] }))
        .to.be.rejectedWith(`Invocation failed: "TEMPLATE_ID_NOT_EXISTS"`);
      await expect(
        contract.methods.template_mint(address, 1, undefined, { onAccount: accounts[1] }))
        .to.be.rejectedWith(`Invocation failed: "ONLY_CONTRACT_OWNER_CALL_ALLOWED"`);
    });

    it('minting', async () => {
      const address = await accounts[0].address();

      // check total supply before minting
      let totalSupply = await contract.methods.total_supply();
      assert.equal(totalSupply.decodedResult, 0)

      // mint all nfts
      for(let i=0; i<collectionTemplateData.templates.length; i++) {
        for(let j=0; j<collectionTemplateData.templates[i].edition_size; j++) {
          const templateMintTx = await contract.methods.template_mint(address, i+1, undefined, { onAccount: accounts[0] });
          totalMintCount++;
          assert.equal(templateMintTx.decodedEvents[0].name, 'TemplateMint');
          assert.equal(templateMintTx.decodedEvents[0].args[0], address);
          assert.equal(templateMintTx.decodedEvents[0].args[1], i+1);
          assert.equal(templateMintTx.decodedEvents[0].args[2], totalMintCount);
          assert.equal(templateMintTx.decodedEvents[0].args[3], `${j+1}`);
          assert.equal(templateMintTx.decodedResult, totalMintCount);
          logGasUsed('template_mint', templateMintTx);
        }
      }

      for(let i=0; i<totalMintCount; i++) {
        allTokensToBeMinted.push(BigInt(i+1));
      }

      // check total supply after minting
      totalSupplyDryRun = await contract.methods.total_supply();
      assert.equal(totalSupplyDryRun.decodedResult, totalMintCount)

      // check amount of NFTs of the owner / minter
      const balanceDryRun = await contract.methods.balance(address);
      assert.equal(balanceDryRun.decodedResult, totalMintCount);

      // check NFT ids of the owner / minter
      const getOwnedTokensDryRun = await contract.methods.get_owned_tokens(address);
      assert.deepEqual(getOwnedTokensDryRun.decodedResult, allTokensToBeMinted);

      // expect metadata for NFT with id "0" to be not existent as we start counting with id "1"
      let metadataDryRun = await contract.methods.metadata(0);
      assert.equal(metadataDryRun.decodedResult, undefined);

      // expect metadata for NFT with id "1" to equal the metadata of the first minted NFT
      metadataDryRun = await contract.methods.metadata(1);
      assert.deepEqual(metadataDryRun.decodedResult.MetadataMap[0], new Map([['template_id', '1'], ['edition_serial', '1']]));

      // expect metadata for NFT with last id to equal the metadata of the last minted NFT
      metadataDryRun = await contract.methods.metadata(totalMintCount);
      assert.deepEqual(metadataDryRun.decodedResult.MetadataMap[0], new Map([['template_id', '8'], ['edition_serial', '8']]));
    });

    it('failed minting - edition size check', async () => {
      const address = await accounts[0].address();
      for(let i=0; i<8; i++) {
        await expect(
          contract.methods.template_mint(address, i+1, undefined, { onAccount: accounts[0] }))
          .to.be.rejectedWith(`Invocation failed: "TEMPLATE_EDITION_SIZE_EXCEEDED"`);
      }
    });


    it('failed transfer', async () => {
      const from = await accounts[0].address();
      await expect(
        contract.methods.transfer(from, 8, { onAccount: accounts[0] }))
        .to.be.rejectedWith(`Invocation failed: "SENDER_MUST_NOT_BE_RECEIVER"`);
    });

    it('transfer', async () => {
      const from = await accounts[0].address();
      
      // expect successful transfer
      const to = await accounts[1].address();
      const transferTx = await contract.methods.transfer(to, totalMintCount, { onAccount: accounts[0] });
      assert.equal(transferTx.decodedEvents[0].name, 'Transfer');
      assert.equal(transferTx.decodedEvents[0].args[0], from);
      assert.equal(transferTx.decodedEvents[0].args[1], to);
      assert.equal(transferTx.decodedEvents[0].args[2], totalMintCount);
      logGasUsed('transfer', transferTx);

      // check balances after transfer
      let balanceDryRun = await contract.methods.balance(from);
      assert.equal(balanceDryRun.decodedResult, totalMintCount - 1);
      balanceDryRun = await contract.methods.balance(to);
      assert.equal(balanceDryRun.decodedResult, 1);

      // check owned NFTs after transfer
      let getOwnedTokensDryRun = await contract.methods.get_owned_tokens(from);
      assert.deepEqual(getOwnedTokensDryRun.decodedResult, allTokensToBeMinted.slice(0, -1));
      getOwnedTokensDryRun = await contract.methods.get_owned_tokens(to);
      assert.deepEqual(getOwnedTokensDryRun.decodedResult, [BigInt(totalMintCount)]);
    });

    it('failed burn', async () => {
      await expect(
        contract.methods.burn(0, { onAccount: accounts[0] }))
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
      burnTx = await contract.methods.burn(totalMintCount, { onAccount: accounts[1] });
      assert.equal(burnTx.decodedEvents[0].name, 'Burn');
      assert.equal(burnTx.decodedEvents[0].args[0], await accounts[1].address());
      assert.equal(burnTx.decodedEvents[0].args[1], totalMintCount);
      logGasUsed('burn', burnTx);

      // check balances after burn
      let balanceDryRun = await contract.methods.balance(await accounts[0].address());
      assert.equal(balanceDryRun.decodedResult, totalMintCount - 2);
      balanceDryRun = await contract.methods.balance(await accounts[1].address());
      assert.equal(balanceDryRun.decodedResult, 0);

      // check owned NFTs after transfer
      let getOwnedTokensDryRun = await contract.methods.get_owned_tokens(await accounts[0].address());
      assert.deepEqual(getOwnedTokensDryRun.decodedResult, allTokensToBeMinted.slice(1, -1));
      getOwnedTokensDryRun = await contract.methods.get_owned_tokens(await accounts[1].address());
      assert.deepEqual(getOwnedTokensDryRun.decodedResult, []);

      // check total supply after burn
      const totalSupplyDryRun = await contract.methods.total_supply();
      assert.equal(totalSupplyDryRun.decodedResult, totalMintCount - 2);
    });

    it('failed update of mutable metadata', async () => {
      const updatedMutableAttributes = '{"level":1}';
      await expect(
        contract.methods.update_mutable_attributes(1, updatedMutableAttributes, { onAccount: accounts[1] }))
        .to.be.rejectedWith(`Invocation failed: "ONLY_CONTRACT_OWNER_CALL_ALLOWED"`);
      await expect(
        contract.methods.update_mutable_attributes(1, updatedMutableAttributes, { onAccount: accounts[0] }))
        .to.be.rejectedWith(`Invocation failed: "TOKEN_NOT_EXISTS"`);
    });

    it('update mutable metadata', async () => {
      const updatedMutableAttributes = '{"level":1}';
      // check current attributes
      let dryRunMetadata = await contract.methods.metadata(2);
      assert.equal(dryRunMetadata.decodedResult.MetadataMap[0].get('mutable_attributes'), undefined);

      // update mutable attributes
      const updateMutableAttributesTx = await contract.methods.update_mutable_attributes(2, updatedMutableAttributes, { onAccount: accounts[0] });
      assert.equal(updateMutableAttributesTx.decodedEvents[0].name, 'MutableAttributesUpdate');
      assert.equal(updateMutableAttributesTx.decodedEvents[0].args[0], 2);
      assert.equal(updateMutableAttributesTx.decodedEvents[0].args[1], updatedMutableAttributes);

      // check updated attributes
      dryRunMetadata = await contract.methods.metadata(2);
      assert.equal(dryRunMetadata.decodedResult.MetadataMap[0].get('mutable_attributes'), updatedMutableAttributes);
    });
  });
});
