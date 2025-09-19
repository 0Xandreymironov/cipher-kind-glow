// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@zama-fhe/oracle-solidity/contracts/FheOracle.sol";

/**
 * @title CipherKindGlow
 * @dev FHE-powered donation platform with encrypted donation amounts
 * @author 0Xandreymironov
 */
contract CipherKindGlow is FheOracle {
    // Events
    event DonationMade(
        address indexed donor,
        bytes32 indexed campaignId,
        bytes encryptedAmount,
        uint256 timestamp
    );
    
    event CampaignCreated(
        bytes32 indexed campaignId,
        address indexed creator,
        string title,
        string description,
        bytes encryptedTargetAmount,
        uint256 timestamp
    );
    
    event CampaignCompleted(
        bytes32 indexed campaignId,
        bytes encryptedTotalRaised,
        uint256 timestamp
    );

    // Structs
    struct Campaign {
        bytes32 id;
        address creator;
        string title;
        string description;
        bytes encryptedTargetAmount;
        bytes encryptedTotalRaised;
        bool isActive;
        uint256 createdAt;
        uint256 completedAt;
        mapping(address => bool) donors;
        uint256 donorCount;
    }

    struct Donation {
        address donor;
        bytes32 campaignId;
        bytes encryptedAmount;
        uint256 timestamp;
    }

    // State variables
    mapping(bytes32 => Campaign) public campaigns;
    mapping(address => Donation[]) public userDonations;
    mapping(bytes32 => Donation[]) public campaignDonations;
    
    bytes32[] public campaignIds;
    uint256 public totalCampaigns;
    uint256 public totalDonations;

    // Modifiers
    modifier onlyActiveCampaign(bytes32 _campaignId) {
        require(campaigns[_campaignId].isActive, "Campaign is not active");
        _;
    }

    modifier onlyCampaignCreator(bytes32 _campaignId) {
        require(
            campaigns[_campaignId].creator == msg.sender,
            "Only campaign creator can perform this action"
        );
        _;
    }

    /**
     * @dev Create a new donation campaign with encrypted target amount
     * @param _title Campaign title
     * @param _description Campaign description
     * @param _encryptedTargetAmount Encrypted target amount using FHE
     */
    function createCampaign(
        string memory _title,
        string memory _description,
        bytes memory _encryptedTargetAmount
    ) external returns (bytes32) {
        bytes32 campaignId = keccak256(
            abi.encodePacked(
                msg.sender,
                _title,
                _description,
                block.timestamp
            )
        );

        Campaign storage campaign = campaigns[campaignId];
        campaign.id = campaignId;
        campaign.creator = msg.sender;
        campaign.title = _title;
        campaign.description = _description;
        campaign.encryptedTargetAmount = _encryptedTargetAmount;
        campaign.encryptedTotalRaised = new bytes(0);
        campaign.isActive = true;
        campaign.createdAt = block.timestamp;
        campaign.completedAt = 0;
        campaign.donorCount = 0;

        campaignIds.push(campaignId);
        totalCampaigns++;

        emit CampaignCreated(
            campaignId,
            msg.sender,
            _title,
            _description,
            _encryptedTargetAmount,
            block.timestamp
        );

        return campaignId;
    }

    /**
     * @dev Make a donation to a campaign with encrypted amount
     * @param _campaignId Campaign ID to donate to
     * @param _encryptedAmount Encrypted donation amount using FHE
     */
    function makeDonation(
        bytes32 _campaignId,
        bytes memory _encryptedAmount
    ) external onlyActiveCampaign(_campaignId) {
        Campaign storage campaign = campaigns[_campaignId];
        
        // Create donation record
        Donation memory donation = Donation({
            donor: msg.sender,
            campaignId: _campaignId,
            encryptedAmount: _encryptedAmount,
            timestamp: block.timestamp
        });

        // Add to mappings
        userDonations[msg.sender].push(donation);
        campaignDonations[_campaignId].push(donation);
        
        // Update campaign state
        if (!campaign.donors[msg.sender]) {
            campaign.donors[msg.sender] = true;
            campaign.donorCount++;
        }

        // Update encrypted total (this would be done with FHE operations)
        // For now, we store the encrypted amount
        if (campaign.encryptedTotalRaised.length == 0) {
            campaign.encryptedTotalRaised = _encryptedAmount;
        } else {
            // In a real implementation, this would use FHE addition
            // For now, we concatenate the encrypted values
            campaign.encryptedTotalRaised = abi.encodePacked(
                campaign.encryptedTotalRaised,
                _encryptedAmount
            );
        }

        totalDonations++;

        emit DonationMade(
            msg.sender,
            _campaignId,
            _encryptedAmount,
            block.timestamp
        );
    }

    /**
     * @dev Complete a campaign (only creator can do this)
     * @param _campaignId Campaign ID to complete
     */
    function completeCampaign(
        bytes32 _campaignId
    ) external onlyCampaignCreator(_campaignId) onlyActiveCampaign(_campaignId) {
        Campaign storage campaign = campaigns[_campaignId];
        campaign.isActive = false;
        campaign.completedAt = block.timestamp;

        emit CampaignCompleted(
            _campaignId,
            campaign.encryptedTotalRaised,
            block.timestamp
        );
    }

    /**
     * @dev Get campaign information
     * @param _campaignId Campaign ID
     * @return Campaign details
     */
    function getCampaign(bytes32 _campaignId) external view returns (
        bytes32 id,
        address creator,
        string memory title,
        string memory description,
        bool isActive,
        uint256 createdAt,
        uint256 completedAt,
        uint256 donorCount
    ) {
        Campaign storage campaign = campaigns[_campaignId];
        return (
            campaign.id,
            campaign.creator,
            campaign.title,
            campaign.description,
            campaign.isActive,
            campaign.createdAt,
            campaign.completedAt,
            campaign.donorCount
        );
    }

    /**
     * @dev Get user's donation history
     * @param _user User address
     * @return Array of user donations
     */
    function getUserDonations(address _user) external view returns (Donation[] memory) {
        return userDonations[_user];
    }

    /**
     * @dev Get campaign donations
     * @param _campaignId Campaign ID
     * @return Array of campaign donations
     */
    function getCampaignDonations(bytes32 _campaignId) external view returns (Donation[] memory) {
        return campaignDonations[_campaignId];
    }

    /**
     * @dev Get all campaign IDs
     * @return Array of campaign IDs
     */
    function getAllCampaigns() external view returns (bytes32[] memory) {
        return campaignIds;
    }

    /**
     * @dev Get platform statistics
     * @return Total campaigns and donations
     */
    function getPlatformStats() external view returns (uint256, uint256) {
        return (totalCampaigns, totalDonations);
    }

    /**
     * @dev Check if user has donated to a campaign
     * @param _campaignId Campaign ID
     * @param _user User address
     * @return True if user has donated
     */
    function hasUserDonated(bytes32 _campaignId, address _user) external view returns (bool) {
        return campaigns[_campaignId].donors[_user];
    }
}
