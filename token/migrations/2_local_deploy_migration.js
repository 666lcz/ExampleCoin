const Token = artifacts.require("Token");
const TokenSale = artifacts.require("TokenSale");

module.exports = function (deployer) {
  deployer.deploy(Token).then(function (tokenContractInstance) {
    const tokenPrice = 1000; // in wei
    return deployer.deploy(
      TokenSale,
      tokenContractInstance.address,
      tokenPrice
    );
  });
};
