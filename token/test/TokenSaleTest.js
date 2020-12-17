const TokenSaleContract = artifacts.require("TokenSale")

contract('TokenSale', function(accounts) {
    let contractInstance;

    beforeEach(async () => {
        contractInstance = await TokenSaleContract.deployed();
    });

    describe('Initial parameters are set correctly', function () {
        it('token contract address is set correctly', async function () {
            expect(await contractInstance.tokenContract()).to.not.equal(0x0);
        });

        it('token price is set correctly', async function () {
            const price = (await contractInstance.tokenPrice()).toNumber();
            expect(price).to.equal(1000);
        });

    });
})