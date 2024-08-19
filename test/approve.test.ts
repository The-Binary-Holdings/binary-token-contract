import { expect } from "chai";
import { ethers } from "hardhat";


describe("BNRYToken - Approvals", function () {
    let bnryToken: any;
    let admin: any;
    let spender: any;

    beforeEach(async function () {
        [admin, spender] = await ethers.getSigners();
        const BNRYTokenFactory = await ethers.getContractFactory("BNRYToken");
        bnryToken = await BNRYTokenFactory.deploy(admin.address);
    });

    it("should approve a spender successfully", async function () {
        // Arrange
        const approvalAmount = ethers.parseEther("100");

        // Act
        await bnryToken.connect(admin).approve(spender.address, approvalAmount);

        // Assert
        const allowance = await bnryToken.allowance(admin.address, spender.address);
        expect(allowance).to.equal(approvalAmount);
    });

    it("should emit an Approval event on successful approval", async function () {
        // Arrange
        const approvalAmount = ethers.parseEther("50");

        // Act & Assert
        await expect(bnryToken.connect(admin).approve(spender.address, approvalAmount))
            .to.emit(bnryToken, "Approval")
            .withArgs(admin.address, spender.address, approvalAmount);
    });

    it("should allow updating the approval amount", async function () {
        // Arrange
        const initialApprovalAmount = ethers.parseEther("50");
        const updatedApprovalAmount = ethers.parseEther("150");

        // Act
        await bnryToken.connect(admin).approve(spender.address, initialApprovalAmount);

        // Assert
        let allowance = await bnryToken.allowance(admin.address, spender.address);
        expect(allowance).to.equal(initialApprovalAmount);

        // Act again to update the approval amount
        await bnryToken.connect(admin).approve(spender.address, updatedApprovalAmount);

        // Assert the updated allowance
        allowance = await bnryToken.allowance(admin.address, spender.address);
        expect(allowance).to.equal(updatedApprovalAmount);
    });

    it("should reset allowance to zero before updating", async function () {
        // Arrange
        const initialApprovalAmount = ethers.parseEther("100");
        const updatedApprovalAmount = ethers.parseEther("0");

        // Act
        await bnryToken.connect(admin).approve(spender.address, initialApprovalAmount);

        // Assert initial allowance
        let allowance = await bnryToken.allowance(admin.address, spender.address);
        expect(allowance).to.equal(initialApprovalAmount);

        // Reset allowance to zero
        await bnryToken.connect(admin).approve(spender.address, updatedApprovalAmount);

        // Assert updated (zero) allowance
        allowance = await bnryToken.allowance(admin.address, spender.address);
        expect(allowance).to.equal(updatedApprovalAmount);
    });

    it("should revert if approving the zero address as a spender", async function () {
        // Arrange
        const approvalAmount = ethers.parseEther("100");

        // Act & Assert
        await expect(
            bnryToken.connect(admin).approve(ethers.ZeroAddress, approvalAmount)
        ).to.be.revertedWith("ERC20: approve to the zero address");
    });
});
