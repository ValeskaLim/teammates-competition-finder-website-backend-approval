// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TeamFinalizeRegistry {
    struct FinalizationRecord {
        address leader;
        uint256 timestamp;
    }

    mapping(uint256 => FinalizationRecord) public finalizedTeams;

    event TeamFinalized(uint256 teamId, address leader);

    function finalizeTeam(uint256 teamId) external {
        require(finalizedTeams[teamId].timestamp == 0, "Already finalized");

        finalizedTeams[teamId] = FinalizationRecord({
            leader: msg.sender,
            timestamp: block.timestamp
        });

        emit TeamFinalized(teamId, msg.sender);
    }

    function getFinalization(
        uint256 teamId
    ) external view returns (address leader, uint256 timestamp) {
        FinalizationRecord memory record = finalizedTeams[teamId];
        // If timestamp is 0, leader is address(0)
        return (record.leader, record.timestamp);
    }
}
