// scripts/local-test.js
const { ethers } = require("hardhat");

async function main() {
  const [owner, member1, member2] = await ethers.getSigners();

  const TeamApproval = await ethers.getContractFactory("TeamApproval");
  const teamApproval = await TeamApproval.deploy();
  await teamApproval.waitForDeployment(); // ethers v6

  console.log("Contract deployed at:", await teamApproval.getAddress());

  // Create proposal (wait for the tx to be mined)
  let tx = await teamApproval.connect(owner).createTeamProposal([owner.address, member1.address, member2.address]);
  await tx.wait();
  console.log("Proposal created with ID = 1");

  // Approvals (wait for each tx)
  tx = await teamApproval.connect(owner).approveTeam(1);
  await tx.wait();
  console.log("Owner approved");

  tx = await teamApproval.connect(member1).approveTeam(1);
  await tx.wait();
  console.log("Member1 approved");

  tx = await teamApproval.connect(member2).approveTeam(1);
  await tx.wait();
  console.log("Member2 approved");

  // Check finalization
  const finalized = await teamApproval.isFinalized(1);
  console.log("Finalized:", finalized);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
