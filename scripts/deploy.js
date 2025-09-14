const hre = require("hardhat");

async function main() {
  const TeamApproval = await hre.ethers.getContractFactory("TeamApproval");
  const teamApproval = await TeamApproval.deploy();
  await teamApproval.waitForDeployment();

  console.log("✅ TeamApproval deployed to:", await teamApproval.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});