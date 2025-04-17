// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Upload {

    struct Access {
        address user;
        bool access;
    }

    struct File {
        string userAddress;
        string fileName;
        string ipfsURL;
        string sha256Hash;
    }

    mapping(address => string[]) private value;  // IPFS file URL mapping
    mapping(address => mapping(address => bool)) private previousData;  // Tracks previous access for each user

    mapping(address => File[]) private passwordHashes;  // Store password hashes for each user and file
    address[] private users; // Track users who have uploaded files
    mapping(address => bool) private userExists; // Ensure unique users only

    // Add IPFS file URL
    function add(address _user, string memory url) external {
        value[_user].push(url);
    }

    // Add encrypted password hash (SHA-256) for each file
    function addPasswordHash(string memory userAddress,string memory fileName, string memory _ipfsURL, string memory sha256Hash) external {
        if (!userExists[msg.sender]) {
            users.push(msg.sender);
            userExists[msg.sender] = true;
        }
        passwordHashes[msg.sender].push(File(userAddress, fileName, _ipfsURL, sha256Hash));
    }

    // Get password hashes for the sender (owner)
    function getPasswordHashes() external view returns (File[] memory) {
        return passwordHashes[msg.sender];
    }

    // Verify if the password matches (for a given user and file)
    function verifyPassword(address user, string memory fileName, string memory passwordAttempt) public view returns (bool) {
        for (uint i = 0; i < passwordHashes[user].length; i++) {
            if (keccak256(abi.encodePacked(passwordAttempt)) == keccak256(abi.encodePacked(passwordHashes[user][i].sha256Hash)) && 
                keccak256(abi.encodePacked(passwordHashes[user][i].fileName)) == keccak256(abi.encodePacked(fileName))) {
                return true;
            }
        }
        return false;
    }

    function getUserFileNamesAndHashes() external view returns (string[] memory, string[] memory) {
        uint length = passwordHashes[msg.sender].length;
        string[] memory fileNames = new string[](length);
        string[] memory hashes = new string[](length);

        for (uint i = 0; i < length; i++) {
            fileNames[i] = passwordHashes[msg.sender][i].fileName;
            hashes[i] = passwordHashes[msg.sender][i].sha256Hash;
        }

        return (fileNames, hashes);
    }

    function getAllFiles() external view returns (File[] memory) {
        uint totalCount = 0;

        // First calculate total number of files
        for (uint i = 0; i < users.length; i++) {
            totalCount += passwordHashes[users[i]].length;
        }

        File[] memory allFiles = new File[](totalCount);
        uint index = 0;

        // Copy all files into a single array
        for (uint i = 0; i < users.length; i++) {
            File[] memory userFiles = passwordHashes[users[i]];
            for (uint j = 0; j < userFiles.length; j++) {
                allFiles[index] = userFiles[j];
                index++;
            }
        }

        return allFiles;
    }

    function requestDownload(address owner, string memory fileName, string memory inputSha256) external view returns (string memory ipfsURL) {
        File[] memory files = passwordHashes[owner];
        for (uint i = 0; i < files.length; i++) {
            if (
                keccak256(abi.encodePacked(files[i].fileName)) == keccak256(abi.encodePacked(fileName)) &&
                keccak256(abi.encodePacked(files[i].sha256Hash)) == keccak256(abi.encodePacked(inputSha256))
            ) {
                return files[i].ipfsURL;
            }
        }
        revert("Invalid SHA-256 hash or file not found");
    }
}
