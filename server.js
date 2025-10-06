import express from "express";
import dotenv from "dotenv";
import { ethers } from "ethers";
import contractJSON from "./artifacts/contracts/FinalizeTeam.sol/TeamFinalizeRegistry.json" assert { type: "json" };
const app = express();

dotenv.config();

app.use(express.json());

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
  res.send("✅ TeamFinalizeRegistry API is running!");
});

app.post("/finalize", async (req, res) => {
  try {
    const { teamId } = req.body;
    if (!teamId) {
      return res.status(400).json({ error: "Missing teamId in request body" });
    }

    const tx = await contract.finalizeTeam(teamId);
    await tx.wait();

    res.json({
      message: "Team finalized successfully",
      teamId,
      txHash: tx.hash,
    });
  } catch (err) {
    console.error("Error finalizing team:", err);
    res.status(500).json({ error: err.message });
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
