const TokenSaleContract = artifacts.require("TokenSale")

contract('Token', function(accounts) {
    describe('Initial parameters are set correctly', function () {
        it('name is set correctly', async function () {
          return Token.deployed().then(async function (instance) {
              expect(await instance.name()).to.equal('Joyce');
          });
        });

        it('symbol is set correctly', async function () {
            return Token.deployed().then(async function (instance) {
                expect(await instance.symbol()).to.equal('JYZ');
            });
          });

        it('total supply is set correctly', async function () {
        return Token.deployed().then(async function (instance) {
            const supply = (await instance.totalSupply()).toNumber();
            expect(supply).to.equal(1000);
        });
        });
    });

})