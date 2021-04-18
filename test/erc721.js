const Erc721 = artifacts.require("ERC721");

contract('ERC721', (accounts) => {
  const happyFlow =  async (erc721Instance, buyer,seller,tokenId) => {
    const sellingPrice = web3.utils.toWei("1","ether")

    // Create the token
    await erc721Instance.mint(seller, tokenId);
    const tokenOwner = await erc721Instance.ownerOf(tokenId);

    assert.equal(tokenOwner,seller, "token owner is incorrect");

    // Set the Price of the token. If no price is set, it cannot be sell
    await erc721Instance.setPrice(tokenOwner, tokenId, sellingPrice);
    const setPrice = await erc721Instance.priceOf(tokenId);

    assert.equal(sellingPrice, setPrice, "price does not match");

    // Set the token to be for Sell. If it is not set, buyers cannot place order
    await erc721Instance.setForSell(tokenOwner, tokenId, true);
    const forSell = await erc721Instance.getForSell(tokenId);

    assert.equal(forSell, true, "forSell status is incorrect");

    // Buyer place order to the token. At the same time, buyer has to pay the sell price to the contract
    const originalBuyerBalance = await web3.eth.getBalance(buyer);
    const orderResponse = await erc721Instance.order(buyer,tokenId,{from: buyer,value: sellingPrice});
    const newBuyerBalance = await web3.eth.getBalance(buyer);
    const orderAddress = await erc721Instance.getOrder(tokenId);

    // Calculate the total gas used
    const buyerGasUsed = orderResponse.receipt.gasUsed;
    const orderTransaction = await web3.eth.getTransaction(orderResponse.tx);
    const buyerGasPrice = orderTransaction.gasPrice;
    const buyerTotalGasCost = parseInt(buyerGasPrice) * parseInt(buyerGasUsed);

    assert.equal(orderAddress, buyer, "order address is incorrect");
    assert.equal(parseInt(originalBuyerBalance) - buyerTotalGasCost - parseInt(sellingPrice), newBuyerBalance, "final balance of buyer is incorrect");

    // Seller approve the order. At the same time, the token is transferd to the buyer and the seller gets paid.
    // After the token is sold, the price is reset to 0 and for sell is set to false.
    const originalSellerBalance = await web3.eth.getBalance(seller);
    const approveResponse = await erc721Instance.approveOrder(seller, tokenId, {from: seller});
    const newSellerBalance = await web3.eth.getBalance(seller);
    const newTokenOwner = await erc721Instance.ownerOf(tokenId);
    const newForSell = await erc721Instance.getForSell(tokenId);
    const newPrice = await erc721Instance.priceOf(tokenId);

    // Calculate the total gas used
    const sellerGasUsed = approveResponse.receipt.gasUsed;
    const approveTransaction = await web3.eth.getTransaction(approveResponse.tx);
    const sellerGasPrice = approveTransaction.gasPrice;
    const sellerTotalGasCost = parseInt(sellerGasPrice) * parseInt(sellerGasUsed);

    assert.equal(newTokenOwner,buyer, "new token owner is incorrect");
    assert.equal(newPrice, 0, "new price should be reset to 0");
    assert.equal(newForSell, false, "forSell status should be reset to false");
    assert.equal(parseInt(originalSellerBalance) - sellerTotalGasCost + parseInt(sellingPrice), newSellerBalance, "final balance of seller is incorrect");
  }

  it("happy flow", async () => {
    const erc721Instance = await Erc721.deployed();
    await happyFlow(erc721Instance,accounts[0],accounts[1],123);
    await happyFlow(erc721Instance,accounts[1],accounts[2],234);
  });
});
