const { ethers } = require("hardhat");

async function main() {
  // Compile & get contract factory
  const TeamFinalizeRegistry = await ethers.getContractFactory("TeamFinalizeRegistry");

  // Deploy contract
  const contract = await TeamFinalizeRegistry.deploy();
  console.log("Contract deployed to:", contract.target);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
