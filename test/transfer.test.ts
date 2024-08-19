import { expect } from "chai";
import { ethers } from "hardhat";

describe("BNRYToken : Transfers", function () {
    let bnryToken: any;
    let admin: any;
    let recipient: any;
    let other: any;

    beforeEach(async function () {
        [admin, recipient, other] = await ethers.getSigners();
        const BNRYTokenFactory = await ethers.getContractFactory("BNRYToken");
        bnryToken = (await BNRYTokenFactory.deploy(admin.address));
    });

    it("should transfer tokens successfully", async function () {
        // Arrange
        const initialAdminBalance = await bnryToken.balanceOf(admin.address);
        const transferAmount = ethers.parseEther("100");

        // Act
        await bnryToken.connect(admin).transfer(recipient.address, transferAmount);

        // Assert
        const finalAdminBalance = await bnryToken.balanceOf(admin.address);
        const recipientBalance = await bnryToken.balanceOf(recipient.address);

        expect(finalAdminBalance).to.equal(initialAdminBalance - transferAmount);
        expect(recipientBalance).to.equal(transferAmount);
    });

    it("should emit a Transfer event on successful transfer", async function () {
        // Arrange
        const transferAmount = ethers.parseEther("50");

        // Act & Assert
        await expect(bnryToken.connect(admin).transfer(recipient.address, transferAmount))
            .to.emit(bnryToken, "Transfer")
            .withArgs(admin.address, recipient.address, transferAmount);
    });

    it("should revert when transferring more tokens than available balance", async function () {
        // Arrange
        const adminBalance = await bnryToken.balanceOf(admin.address);
        const transferAmount = adminBalance + ethers.parseEther("1"); // more than the balance

        // Act & Assert
        await expect(bnryToken.connect(admin).transfer(recipient.address, transferAmount)).to.be.revertedWith(
            "ERC20: transfer amount exceeds balance"
        );
    });

    it("should revert when transferring tokens to the zero address", async function () {
        // Arrange
        const transferAmount = ethers.parseEther("10");

        // Act & Assert
        await expect(
            bnryToken.connect(admin).transfer(ethers.ZeroAddress, transferAmount)
        ).to.be.revertedWith("ERC20: transfer to the zero address");
    });

    it("should allow transferring the entire balance", async function () {
        // Arrange
        const adminBalance = await bnryToken.balanceOf(admin.address);

        // Act
        await bnryToken.connect(admin).transfer(recipient.address, adminBalance);

        // Assert
        const finalAdminBalance = await bnryToken.balanceOf(admin.address);
        const recipientBalance = await bnryToken.balanceOf(recipient.address);

        expect(finalAdminBalance).to.equal(0);
        expect(recipientBalance).to.equal(adminBalance);
    });

    it("should allow transfers between non-admin accounts", async function () {
        // Arrange
        const transferAmount = ethers.parseEther("100");

        // Transfer some tokens to `other` so they have a balance
        await bnryToken.connect(admin).transfer(other.address, transferAmount);

        // Act
        await bnryToken.connect(other).transfer(recipient.address, transferAmount);

        // Assert
        const finalOtherBalance = await bnryToken.balanceOf(other.address);
        const recipientBalance = await bnryToken.balanceOf(recipient.address);

        expect(finalOtherBalance).to.equal(0);
        expect(recipientBalance).to.equal(transferAmount);
    });

    it("should not increase total supply after a transfer", async function () {
        // Arrange
        const initialTotalSupply = await bnryToken.totalSupply();
        const transferAmount = ethers.parseEther("100");

        // Act
        await bnryToken.connect(admin).transfer(recipient.address, transferAmount);

        // Assert
        const finalTotalSupply = await bnryToken.totalSupply();

        expect(finalTotalSupply).to.equal(initialTotalSupply);
    });
});
