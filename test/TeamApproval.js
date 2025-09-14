const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TeamApproval", function () {
  let teamApproval, owner, member1, member2, outsider;

  beforeEach(async function () {
    [owner, member1, member2, outsider] = await ethers.getSigners();
    const TeamApproval = await ethers.getContractFactory("TeamApproval");
    teamApproval = await TeamApproval.deploy();
    await teamApproval.waitForDeployment(); // v6
  });

  it("should create a team proposal", async function () {
    await teamApproval.createTeamProposal([owner.address, member1.address, member2.address]);
    const finalized = await teamApproval.isFinalized(1);
    expect(finalized).to.equal(false);
  });

  it("should allow members to approve and finalize", async function () {
    await teamApproval.createTeamProposal([owner.address, member1.address, member2.address]);
    console.log("Proposer:", owner.address);
    console.log("member 1:", member1.address);
    console.log("member 2:", member2.address);

    await teamApproval.connect(owner).approveTeam(1);
    await teamApproval.connect(member1).approveTeam(1);
    await teamApproval.connect(member2).approveTeam(1);

    const finalized = await teamApproval.isFinalized(1);
    expect(finalized).to.equal(true);
  });

  it("should reject non-member approvals", async function () {
    await teamApproval.createTeamProposal([owner.address, member1.address, member2.address]);
    await expect(teamApproval.connect(outsider).approveTeam(1))
      .to.be.revertedWith("You are not in this proposal");
  });
});
