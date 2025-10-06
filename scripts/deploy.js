// scripts/deploy.js
const { ethers } = require("hardhat");

async function main() {
  // Compile & get contract factory
  const TeamFinalizeRegistry = await ethers.getContractFactory("TeamFinalizeRegistry");

  // Deploy contract
  const contract = await TeamFinalizeRegistry.deploy(); // Ethers v6 returns deployed contract
  console.log("Contract deployed to:", contract.address); // .target is the deployed address in v6
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
