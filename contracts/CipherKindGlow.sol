// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title CipherKindGlow
 * @dev FHE-powered donation platform with encrypted donation amounts
 * @author 0Xandreymironov
 */
contract CipherKindGlow is SepoliaConfig {
    // Events
    event DonationMade(
        address indexed donor,
        bytes32 indexed campaignId,
        uint256 timestamp
    );
    
    event CampaignCreated(
        bytes32 indexed campaignId,
        address indexed creator,
        string title,
        string description,
        uint256 timestamp
    );
    
    event CampaignCompleted(
        bytes32 indexed campaignId,
        uint256 timestamp
    );

    // Structs
    struct Campaign {
        bytes32 id;
        address creator;
        string title;
        string description;
        euint32 encryptedTargetAmount;
        euint32 encryptedTotalRaised;
        bool isActive;
        uint256 createdAt;
        uint256 completedAt;
        mapping(address => bool) donors;
        uint256 donorCount;
        uint256 donationCount; // public stats without touching encrypted amounts
    }

    struct Donation {
        address donor;
        bytes32 campaignId;
        euint32 encryptedAmount;
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
     * @param _inputProof Proof for the encrypted target amount
     */
    function createCampaign(
        string memory _title,
        string memory _description,
        externalEuint32 _encryptedTargetAmount,
        bytes calldata _inputProof
    ) external returns (bytes32) {
        bytes32 campaignId = keccak256(
            abi.encodePacked(
                msg.sender,
                _title,
                _description,
                block.timestamp
            )
        );

        // Convert external ciphertext to internal encrypted type
        euint32 encryptedTarget = FHE.fromExternal(_encryptedTargetAmount, _inputProof);

        Campaign storage campaign = campaigns[campaignId];
        campaign.id = campaignId;
        campaign.creator = msg.sender;
        campaign.title = _title;
        campaign.description = _description;
        campaign.encryptedTargetAmount = encryptedTarget;
        campaign.encryptedTotalRaised = FHE.asEuint32(0);
        campaign.isActive = true;
        campaign.createdAt = block.timestamp;
        campaign.completedAt = 0;
        campaign.donorCount = 0;

        // Set ACL permissions for the encrypted target amount
        FHE.allowThis(campaign.encryptedTargetAmount);
        FHE.allow(campaign.encryptedTargetAmount, msg.sender);

        campaignIds.push(campaignId);
        totalCampaigns++;

        emit CampaignCreated(
            campaignId,
            msg.sender,
            _title,
            _description,
            block.timestamp
        );

        return campaignId;
    }

    /**
     * @dev Make a donation to a campaign with encrypted amount
     * @param _campaignId Campaign ID to donate to
     * @param _encryptedAmount Encrypted donation amount using FHE
     * @param _inputProof Proof for the encrypted donation amount
     */
    function makeDonation(
        bytes32 _campaignId,
        externalEuint32 _encryptedAmount,
        bytes calldata _inputProof
    ) external onlyActiveCampaign(_campaignId) {
        // Convert external ciphertext to internal encrypted type
        euint32 encryptedDonationAmount = FHE.fromExternal(_encryptedAmount, _inputProof);
        
        // Create donation record
        Donation memory donation = Donation({
            donor: msg.sender,
            campaignId: _campaignId,
            encryptedAmount: encryptedDonationAmount,
            timestamp: block.timestamp
        });

        // Add to mappings
        userDonations[msg.sender].push(donation);
        campaignDonations[_campaignId].push(donation);
        
        // Set ACL permissions (like aidwell-connect)
        FHE.allowThis(donation.encryptedAmount);
        FHE.allow(donation.encryptedAmount, msg.sender);

        // Public stats (do not update encrypted totals to avoid extra constraints)
        Campaign storage c = campaigns[_campaignId];
        if (!c.donors[msg.sender]) {
            c.donors[msg.sender] = true;
            c.donorCount++;
        }
        c.donationCount++;
        
        totalDonations++;

        emit DonationMade(
            msg.sender,
            _campaignId,
            block.timestamp
        );
    }

    /**
     * @dev Get public stats for a campaign (no FHE involved)
     * @param _campaignId Campaign ID
     * @return donorCount Number of unique donors
     * @return donationCount Number of donations
     */
    function getCampaignStats(bytes32 _campaignId) external view returns (uint256 donorCount, uint256 donationCount) {
        Campaign storage c = campaigns[_campaignId];
        return (c.donorCount, c.donationCount);
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
            block.timestamp
        );
    }

    /**
     * @dev Get campaign information
     * @param _campaignId Campaign ID
     * @return id Campaign ID
     * @return creator Campaign creator
     * @return title Campaign title
     * @return description Campaign description
     * @return isActive Campaign active status
     * @return createdAt Campaign creation timestamp
     * @return completedAt Campaign completion timestamp
     * @return donorCount Number of donors
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
     * @dev Get encrypted campaign data
     * @param _campaignId Campaign ID
     * @return encryptedTargetAmount Encrypted target amount
     * @return encryptedTotalRaised Encrypted total raised amount
     */
    function getCampaignEncryptedData(bytes32 _campaignId) external view returns (
        euint32 encryptedTargetAmount,
        euint32 encryptedTotalRaised
    ) {
        Campaign storage campaign = campaigns[_campaignId];
        return (
            campaign.encryptedTargetAmount,
            campaign.encryptedTotalRaised
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
