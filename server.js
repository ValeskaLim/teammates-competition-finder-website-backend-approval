import express from "express";
import dotenv from "dotenv";
import { ethers } from "ethers";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import contractJSON from "./artifacts/contracts/FinalizeTeam.sol/TeamFinalizeRegistry.json" assert { type: "json" };
const app = express();

dotenv.config();

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to local Hardhat network
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL_LOCALHOST);

// Use wallet to sign transactions
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Import compiled ABI
const contractAddress = process.env.CONTRACT_ADDRESS;

// Create contract instance
const contract = new ethers.Contract(contractAddress, contractJSON.abi, wallet);

// Example
app.get("/", (req, res) => {
  res.send("TeamFinalizeRegistry API is running!");
});

app.post("/finalize", async (req, res) => {
  try {
    const { teamId } = req.body;
    if (!teamId) {
      return res.status(400).json({ error: "Missing teamId in request body" });
    }

    const tx = await contract.finalizeTeam(teamId);
    const receipt = await tx.wait();

    const uploadsDir = path.join(__dirname, "uploads", "finalizations");
    fs.mkdirSync(uploadsDir, { recursive: true });

    const filename = `team_${teamId}_${Date.now()}.txt`;
    const filepath = path.join(uploadsDir, filename);
    const fileContent = [
      `Team Finalization Result`,
      `------------------------`,
      `Team ID: ${teamId}`,
      `Tx Hash: ${tx.hash}`,
      `From: ${receipt.from}`,
      `To: ${receipt.to}`,
      `Block Number: ${receipt.blockNumber}`,
      `Gas Used: ${receipt.gasUsed.toString()}`,
      `Timestamp: ${new Date().toLocaleString("id-ID", { timeZone: 'Asia/Jakarta' })}`,
    ].join("\n");

    fs.writeFileSync(filepath, fileContent, "utf8");

    console.log(`Saved transaction result: ${filepath}`);

    res.json({
      message: "Team finalized successfully",
      teamId,
      txHash: tx.hash,
    });

  } catch (err) {
    console.error("Error finalizing team:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: err.message });
    }
  }
});

app.get("/finalization/:teamId", async (req, res) => {
  try {
    const teamId = req.params.teamId;
    const [leader, timestamp] = await contract.getFinalization(teamId);

    res.json({
      teamId,
      leader,
      timestamp: Number(timestamp),
      finalized: timestamp > 0,
    });
  } catch (err) {
    console.error("Error getting finalization:", err);
    res.status(500).json({ error: err.message });
  }
});

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
