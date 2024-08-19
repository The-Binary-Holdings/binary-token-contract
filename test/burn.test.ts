import { expect } from "chai";
import { ethers } from "hardhat";


describe("BNRYToken - Burning", function () {
    let bnryToken: any;
    let admin: any;
    let user: any;

    beforeEach(async function () {
        [admin, user] = await ethers.getSigners();
        const BNRYTokenFactory = await ethers.getContractFactory("BNRYToken");
        bnryToken = await BNRYTokenFactory.deploy(admin.address);
    });

    it("should burn tokens from the caller's account", async function () {
        // Arrange
        const burnAmount = ethers.parseEther("100");
        const initialSupply = await bnryToken.totalSupply();
        const initialBalance = await bnryToken.balanceOf(admin.address);

        // Act
        await bnryToken.connect(admin).burn(burnAmount);

        // Assert
        const finalSupply = await bnryToken.totalSupply();
        const finalBalance = await bnryToken.balanceOf(admin.address);

        expect(finalSupply).to.equal(initialSupply - burnAmount);
        expect(finalBalance).to.equal(initialBalance - burnAmount);
    });

    it("should emit a Burn event when tokens are burned", async function () {
        // Arrange
        const burnAmount = ethers.parseEther("50");

        // Act & Assert
        await expect(bnryToken.connect(admin).burn(burnAmount))
            .to.emit(bnryToken, "Transfer")
            .withArgs(admin.address, ethers.ZeroAddress, burnAmount);
    });

    it("should revert if burn amount exceeds balance", async function () {
        // Arrange
        const burnAmount = ethers.parseEther("10000000001"); // More than the initial balance

        // Act & Assert
        await expect(bnryToken.connect(admin).burn(burnAmount)).to.be.revertedWith(
            "ERC20: burn amount exceeds balance"
        );
    });

    it("should allow a user to burn tokens from their account", async function () {
        // Arrange
        const transferAmount = ethers.parseEther("500");
        const burnAmount = ethers.parseEther("200");

        // Transfer tokens to user
        await bnryToken.connect(admin).transfer(user.address, transferAmount);
        const initialUserBalance = await bnryToken.balanceOf(user.address);

        // Act
        await bnryToken.connect(user).burn(burnAmount);

        // Assert
        const finalUserBalance = await bnryToken.balanceOf(user.address);
        expect(finalUserBalance).to.equal(initialUserBalance - burnAmount);
    });

    it("should reduce total supply after a user burns tokens", async function () {
        // Arrange
        const transferAmount = ethers.parseEther("500");
        const burnAmount = ethers.parseEther("200");

        // Transfer tokens to user
        await bnryToken.connect(admin).transfer(user.address, transferAmount);
        const initialTotalSupply = await bnryToken.totalSupply();

        // Act
        await bnryToken.connect(user).burn(burnAmount);

        // Assert
        const finalTotalSupply = await bnryToken.totalSupply();
        expect(finalTotalSupply).to.equal(initialTotalSupply - burnAmount);
    });
});
