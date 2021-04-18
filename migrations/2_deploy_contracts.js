const Erc721 = artifacts.require("ERC721");

module.exports = function(deployer) {
  deployer.deploy(Erc721,"Refinable", "FINE");
};
