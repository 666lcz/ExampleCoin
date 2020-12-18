const TokenContract = artifacts.require("Token");
const TokenSaleContract = artifacts.require("TokenSale");
const truffleAssert = require("truffle-assertions");
const BN = require("bn.js");
const { expect } = require("chai");

contract("TokenSale", function (accounts) {
  let contractInstance;
  let tokenContractInstance;
  const tokenPrice = 1000; // in wei
  const numTokens = 10;
  const admin = accounts[0];
  const buyer = accounts[1];
  const value = numTokens * tokenPrice;
  const numTokenForInitialSale = 750;

  beforeEach(async () => {
    tokenContractInstance = await TokenContract.new();
    contractInstance = await TokenSaleContract.new(
      tokenContractInstance.address,
      tokenPrice
    );
    await tokenContractInstance.transfer(
      contractInstance.address,
      numTokenForInitialSale,
      { from: admin }
    );
  });

  describe("should set initial parameters coorectly", function () {
    it("should set token contract address correctly", async function () {
      expect(await contractInstance.tokenContract()).to.not.equal(0x0);
    });

    it("should set token price correctly", async function () {
      const price = await contractInstance.tokenPrice();
      price.should.be.a.bignumber.that.equals(tokenPrice.toString());
    });
  });

  describe("Token buying", function () {
    it("should keep track of token sold correctly", async function () {
      await contractInstance.buyTokens(numTokens, {
        from: buyer,
        value: value,
      });
      const tokenSoldAmount = await contractInstance.tokenSold();
      tokenSoldAmount.should.be.a.bignumber.that.equals(numTokens.toString());
    });

    it("should emit the sell event", async function () {
      const receipt = await contractInstance.buyTokens(numTokens, {
        from: buyer,
        value: value,
      });
      truffleAssert.eventEmitted(receipt, "Sell", (ev) => {
        ev._buyer.should.equals(buyer);
        return ev._amount.should.be.a.bignumber.that.equals(
          numTokens.toString()
        );
      });
    });

    it("should enforce the right price", async function () {
      await truffleAssert.fails(
        contractInstance.buyTokens(numTokens, {
          from: buyer,
          value: value + 1,
        }),
        truffleAssert.ErrorType.REVERT
      );
    });

    it("should enforce the contract has enough tokens", async function () {
      const numTokensToBuy = numTokenForInitialSale + 1;

      await truffleAssert.fails(
        contractInstance.buyTokens(numTokensToBuy, {
          from: buyer,
          value: numTokensToBuy * tokenPrice,
        }),
        truffleAssert.ErrorType.REVERT
      );
    });

    it("should transfer the right amount of tokens", async function () {
      await contractInstance.buyTokens(numTokens, {
        from: buyer,
        value: value,
      });
      const expectedNumRemainingToken = numTokenForInitialSale - numTokens;
      (
        await tokenContractInstance.balanceOf(contractInstance.address)
      ).should.be.a.bignumber.that.equals(expectedNumRemainingToken.toString());
      (
        await tokenContractInstance.balanceOf(buyer)
      ).should.be.a.bignumber.that.equals(numTokens.toString());
    });
  });
});
