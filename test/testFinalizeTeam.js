require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

async function main() {
  // 1️⃣ Connect to your local Hardhat node
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

  // 2️⃣ Use the first account from Hardhat node
  const wallet = new ethers.Wallet(
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", // Account #0
    provider
  );

  // 3️⃣ Load contract ABI and address
  const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // replace with your deployed address
  const abiPath = path.join(
    __dirname,
    "../artifacts/contracts/FinalizeTeam.sol/TeamFinalizeRegistry.json"
  );
  const contractJson = JSON.parse(fs.readFileSync(abiPath, "utf8"));
  const contractABI = contractJson.abi;

  const contract = new ethers.Contract(contractAddress, contractABI, wallet);
  console.log("✅ Connected to contract at:", contractAddress);

  const teamId = 2;

  // 4️⃣ Check if the team has already been finalized safely
  let record;
  try {
    record = await contract.callStatic.getFinalization(teamId);
    // Check if timestamp is zero
    if (record[1].eq(0)) {
      console.log("No previous finalization record found, proceeding...");
    } else {
      console.log("❌ Team already finalized!");
      console.log("Leader:", record[0]);
      console.log("Timestamp:", record[1].toString());
      return;
    }
  } catch (err) {
    console.log("No previous finalization record found, proceeding...");
  }

  // 5️⃣ Finalize the team
  console.log("⏳ Finalizing team...");
  const tx = await contract.finalizeTeam(teamId);
  const receipt = await tx.wait(); // ✅ Wait for confirmation
  console.log("✅ Team finalized successfully!");
  console.log("Transaction hash:", tx.hash);

  // 6️⃣ Read finalization data after mining
  const finalRecord = await contract.getFinalization(teamId);
  console.log("Leader:", finalRecord[0]);
  console.log("Timestamp:", finalRecord[1].toString());
}

main().catch((err) => {
  console.error("❌ Error:", err);
});
