# Team Approval Smart Contract

A Solidity smart contract that allows a group of **3 members** to form a team proposal.
All 3 members must approve the proposal before it becomes **finalized**.

This project uses **Hardhat** for development, testing, and deployment.

---

## 📖 Features
- Create a team proposal (with exactly 3 members).
- Approve proposals (only by members of the team).
- Finalize proposals automatically when all 3 approve.
- Reject approvals from non-members.
- Tested with Hardhat & Chai.
- Ready for deployment to Ethereum testnets (e.g., Sepolia).

---

## 🛠️ Technologies Used
- **Solidity** → Smart contract programming language.
- **Hardhat (v2)** → Ethereum development environment.
- **Ethers.js** → Library for interacting with Ethereum contracts.
- **Hardhat Toolbox** → Plugins for testing, debugging, and deployment.
- **Hardhat Ignition** → Deployment framework.
- **Chai** → Assertion library for testing.
- **TypeChain** → Generates TypeScript bindings.
- **Solidity Coverage** → Provides test coverage reports.
- **Hardhat Gas Reporter** → Analyzes gas usage.
- **Hardhat Verify** → Verifies contracts on Etherscan.

---

## ⚙️ Installation
Clone the repo and install dependencies:
```bash
git clone https://github.com/ValeskaLim/system-recommendation-be-approval.git
cd team-approval
npm install
