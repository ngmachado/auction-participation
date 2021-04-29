const SuperERC721 = artifacts.require("SuperERC721");

contract("SuperERC721", accounts => {

  it("should multi mint based on parameters", async () => {
        const howManyTokens = 50;
        const erc721 = await SuperERC721.new("TestERC721", "x721", "https://superfluid.finance");
        await erc721.multiMint(accounts[0], howManyTokens);
        const minterBalance = await erc721.balanceOf(accounts[0]);
        assert.equal(howManyTokens.toString(), minterBalance.toString(), "number of new minted tokens is wrong");
  });

  it("should multi mint in batch", async () => {
        const howManyTokens = 200;
        const batchSize = 20;
        const erc721 = await SuperERC721.new("TestERC721", "x721", "https://superfluid.finance");
        for(let i = 1; i <= (howManyTokens / batchSize); i++) {
            await erc721.multiMint(accounts[0], batchSize);
        }
        const minterBalance = await erc721.balanceOf(accounts[0]);
        assert.equal(howManyTokens.toString(), minterBalance.toString(), "number of new minted tokens is wrong");
  });

  it("should use the same tokenURI to all tokens", async () => {
        const tokenURI = "https://superfluid.finance";
        const howManyTokens = 200;
        const batchSize = 20;
        const erc721 = await SuperERC721.new("TestERC721", "x721", tokenURI);
        for(let i = 1; i <= (howManyTokens / batchSize); i++) {
            await erc721.multiMint(accounts[0], batchSize);
        }
        for(let i=0; i < 10; i++) {
            const tokenId = Math.floor(Math.random() * howManyTokens) + 1;
            const randomTokenURI = await erc721.tokenURI(tokenId);
            assert.equal(tokenURI.toString(), randomTokenURI.toString(), "wrong tokenURI");
        }
  });

  it.only("should multi send to proper receiver", async () => {
        const tokenURI = "https://superfluid.finance";
        const howManyTokens = 50;
        const erc721 = await SuperERC721.new("TestERC721", "x721", tokenURI);
        await erc721.multiMint(accounts[0], howManyTokens);
        
        let receivers = [];
        let tokensIds = [];
        for(let i=1; i <= 9; i++) {
            receivers.push(accounts[i]);
            tokensIds.push(i);
        }
        await erc721.multiSend(receivers, tokensIds);
        for(let i=1; i <= 9; i++) {
            assert.equal(accounts[i].toString(), (await erc721.ownerOf(i)).toString(), "wrong owner of token");
        }
        const minterBalance = await erc721.balanceOf(accounts[0]);
        assert.equal((howManyTokens - tokensIds.length), minterBalance.toString(), "number of left minter tokens is wrong");
  });
});