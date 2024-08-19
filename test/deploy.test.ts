import { expect } from "chai";
import { ethers } from "hardhat";


describe("BNRYToken : Deployments", function () {
    let bnryToken: any;
    let admin: any;
    let recipient: any;

    beforeEach(async function () {
        [admin, recipient] = await ethers.getSigners();
    });

    it("should deploy and set the correct initial supply", async function () {
        // Arrange
        const expectedInitialSupply = ethers.parseEther("10000000000"); // 10 billion tokens with 18 decimals

        // Act
        const BNRYTokenFactory = await ethers.getContractFactory("BNRYToken");
        bnryToken = await BNRYTokenFactory.deploy(admin.address);

        // Assert
        const totalSupply = await bnryToken.totalSupply();
        const adminBalance = await bnryToken.balanceOf(admin.address);

        expect(totalSupply).to.equal(expectedInitialSupply);
        expect(adminBalance).to.equal(expectedInitialSupply);
    });

    it("should revert if the admin address is the zero address", async function () {
        // Act & Assert
        const BNRYTokenFactory = await ethers.getContractFactory("BNRYToken");
        await expect(BNRYTokenFactory.deploy(ethers.ZeroAddress)).to.be.revertedWith("ADDRESS_ZERO");
    });
});
