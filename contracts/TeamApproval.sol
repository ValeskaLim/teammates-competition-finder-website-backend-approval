// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TeamApproval {

    // Define a structure to hold team proposal details
    struct TeamProposal {
        address proposer;
        address[3] members;
        mapping(address => bool) approvals;
        uint8 approvalsCount;
        bool finalized;
    }

    uint256 public proposalCount;

    // Mapping from proposal ID to TeamProposal
    mapping(uint256 => TeamProposal) public proposals;

    event TeamProposed(uint256 proposalId, address[3] members);
    event TeamApproved(uint256 proposalId, address member);
    event TeamFinalized(uint256 proposalId);

    // Modifier to check if the caller is a member of the proposal
    modifier onlyMember(uint256 proposalId) {
        require(isMember(proposalId, msg.sender), "You are not in this proposal");
        _;
    }

    // Create team proposal with exactly 3 members
    function createTeamProposal(address[3] calldata members) external {
        require(
            members[0] == msg.sender || 
            members[1] == msg.sender || 
            members[2] == msg.sender,
            "Proposer must be in team"
        );

        proposalCount++;
        TeamProposal storage proposal = proposals[proposalCount];
        proposal.proposer = msg.sender;
        proposal.members = members;

        emit TeamProposed(proposalCount, members);
    }

    // Only team members can approve the proposal
    function approveTeam(uint256 proposalId) external onlyMember(proposalId) {
        TeamProposal storage proposal = proposals[proposalId];

        // User cannot approve more than once and cannot approve if already finalized
        require(!proposal.finalized, "Already finalized");
        require(!proposal.approvals[msg.sender], "Already approved");

        proposal.approvals[msg.sender] = true;
        proposal.approvalsCount++;

        emit TeamApproved(proposalId, msg.sender);

        if (proposal.approvalsCount == 3) {
            proposal.finalized = true;
            emit TeamFinalized(proposalId);
        }
    }

    // Check if a user is a member of the proposal
    function isMember(uint256 proposalId, address user) public view returns (bool) {
        TeamProposal storage proposal = proposals[proposalId];
        return (
            proposal.members[0] == user ||
            proposal.members[1] == user ||
            proposal.members[2] == user
        );
    }

    // Check if a proposal is finalized
    function isFinalized(uint256 proposalId) external view returns (bool) {
        return proposals[proposalId].finalized;
    }
}
