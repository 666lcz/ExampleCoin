const Token = artifacts.require("Token");
const TokenSale = artifacts.require("TokenSale");

module.exports = function (deployer) {
  deployer.deploy(Token);
  deployer.deploy(TokenSale);
};
