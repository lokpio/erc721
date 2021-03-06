# ERC 721
## Prerequisite
* Truffle
* Solidity 0.8.0
## Intro
The smart contract is base on the audited [openzepplin](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol) ERC 721. Addition logic is added for users to mint and buy from each other using ETH.

## Flow
1. Create the token

    ```
    function mint(address to, uint tokenId) public
    ```
2. Set the price of the token in wei

    ```
    function setPrice(address from, uint256 tokenId, uint256 price) public
    ```
3. Set the token to for sell (For forSell variable: true if you want to sell, false if you dont want to sell)
    ```
   function setForSell(address from, uint256 tokenId, bool forSell) public
   ```
4. Buyer places order to the token and pay ETH
    ```
   function order(address to, uint256 tokenId) public payable
   ```
5. Seller approves the order
    ```
    function approveOrder(address from, uint256 tokenId) public
    ```

## Query
Get Price of token
```
function priceOf(uint256 tokenId) external view returns (uint256)
```
Get address that order the token
```
function getOrder(uint256 tokenId) external view returns (address)
```
Check if the token is for sell or not
```
function getForSell(uint256 tokenId) external view returns (bool)
```
Check Ownership of the token
```
function ownerOf(uint256 tokenId) public view virtual override returns (address)
```

## Run Test
The Test includes a happy flow scenario on how to interact with the contract to do transactions.
```
truffle test ./test/erc721.js
```

## Improvement
For now, it requires the seller to confirm the order. In the future, another contract maybe deployed and act as the operator(middle man) to facilitate the whole process.
It should result auto swapping between the Nft and ETH. Also, the new contract can act as the wallet to hold all the selling Nfts etc...