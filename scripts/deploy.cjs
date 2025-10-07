const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  // Compile & get contract factory
  const TeamFinalizeRegistry = await ethers.getContractFactory("TeamFinalizeRegistry");

  // Deploy contract
  const contract = await TeamFinalizeRegistry.deploy();
  console.log("Contract deployed to:", contract.target);

  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("Deployed at:", address);

  // Save contract address to .env
  let env = fs.readFileSync(".env", "utf8");
  env = env.replace(/CONTRACT_ADDRESS=.*/g, `CONTRACT_ADDRESS=${address}`);
  fs.writeFileSync(".env", env);

  console.log("✅ Updated .env with new CONTRACT_ADDRESS");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
