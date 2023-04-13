// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MVSerial is ERC721Enumerable, Ownable {
    // Data ------------------------------------------------
    struct MVSerialData {
        uint256 key; // Key to unlock the serial
        uint256 serial; // the serial itself
        uint256 clubID; // club to which the NFT belongs
        string uri; // uri for the token
        bool serialLocked; // is the serial Locked / Unlocked
    }

    mapping(uint256 => uint256[]) private _referenceList; // List of NFTs to display per clubID

    mapping(uint256 => MVSerialData) private _MVSerialData;
    uint256 tokenRef; // incremented after each mint

    // Modifiers ------------------------------------------------
    modifier locked(uint256 id) {
        require(_MVSerialData[id].serialLocked == true, "already unlocked");
        _;
    }
    modifier unlocked(uint256 id) {
        require(_MVSerialData[id].serialLocked == false);
        _;
    }

    // Events ------------------------------------------------
    event Unlocked(address by, uint256 tokenId);
    event Minted(address by, uint256 tokenId);

    // Methods ------------------------------------------------
    constructor() ERC721("MVSerial", "MVS") {}

    // Unlock the NFT for a user and set is as owner.
    function unlock(uint256 id, string memory _str) external locked(id) {
        require(msg.sender != ERC721.ownerOf(id), "must not be owner"); // if we already are the owner, no unlock allowed
        require(_MVSerialData[id].key != 0, "NFT not Minted"); // Make sure the NFT is minted
        require(
            _MVSerialData[id].key ==
                uint256(keccak256(((abi.encodePacked(_str))))),
            "Incorrect Serial"
        );

        _MVSerialData[id].serialLocked = false;
        _approve(msg.sender, id);
        safeTransferFrom(owner(), msg.sender, id);
        emit Unlocked(msg.sender, id);
    }

    // function to mint the NFT
    function mint(
        bool isReference, // Used to specify if should be shown in gallery
        uint256 clubID,
        uint256 key,
        uint256 serial,
        string memory Uri
    ) external onlyOwner {
        _mint(msg.sender, tokenRef); //  call the base mint
        _MVSerialData[tokenRef].key = key; //  Set our proprietary data
        _MVSerialData[tokenRef].serial = serial;
        _MVSerialData[tokenRef].uri = Uri;
        _MVSerialData[tokenRef].serialLocked = true;
        _MVSerialData[tokenRef].clubID = clubID;
        if (isReference) _referenceList[clubID].push(tokenRef); // if is a reference, then list the token
        emit Minted(msg.sender, tokenRef); // we then emit the event
        tokenRef++; // We minted an NFT, we need to increment the base ref
    }

    // Returns all the reference NFTs for a given Club.
    function getClubTokenList(uint256 clubID)
        external
        view
        returns (uint256[] memory)
    {
        return _referenceList[clubID];
    }

    // Returns the club of a given token.
    function getClub(uint256 tokenId) external view returns (uint256) {
        require(
            _exists(tokenId),
            "ERC721Metadata: Club query for nonexistent token"
        );
        return _MVSerialData[tokenId].clubID;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        return _MVSerialData[tokenId].uri;
    }

    // Getters ------------------------------------------------
    function getSerial(uint256 id) external view returns (uint256) {
        return _MVSerialData[id].serial;
    }

    function isLocked(uint256 id) external view returns (bool) {
        return _MVSerialData[id].serialLocked;
    }
}
