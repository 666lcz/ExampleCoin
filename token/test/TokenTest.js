const Token = artifacts.require("Token");

contract("Token", function (accounts) {
  let contractInstance;
  beforeEach(async () => {
    contractInstance = await Token.deployed();
  });
  describe("Initial parameters are set correctly", function () {
    it("name is set correctly", async function () {
      expect(await contractInstance.name()).to.equal("Joyce");
    });

    it("symbol is set correctly", async function () {
      expect(await contractInstance.symbol()).to.equal("JYZ");
    });

    it("total supply is set correctly", async function () {
      const supply = (await contractInstance.totalSupply()).toNumber();
      expect(supply).to.equal(1000);
    });
  });
});
