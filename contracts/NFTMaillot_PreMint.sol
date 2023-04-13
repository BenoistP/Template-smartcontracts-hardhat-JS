// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


    contract NFTMaillot_PreMint is ERC721, Ownable {
        using Counters for Counters.Counter;
	    Counters.Counter private _tokenIds;

        constructor(string memory _baseURI) ERC721("Maillot", "MAI"){
            baseURI = _baseURI;
        }

        struct NFT {
            uint idToken;
            string Uri;
            bool unlocked; 
        }

        mapping(uint => NFT) public NFTs;

        uint maxSupply = 50;
        string baseURI;
        uint [] key;

        event minted(uint tokenId, address caller, string Uri);
        event passwordAdd();
        event transferUnlocked(address caller , uint tokenId);

        modifier unlocked(uint id) {require(NFTs[id].unlocked==false); _;}


        function mintNft(string memory Uri) public onlyOwner{
            uint tokenId = _tokenIds.current();
            require(tokenId < maxSupply, "Max mint");
            _mint(msg.sender, tokenId);


            NFTs[tokenId].idToken = tokenId;
            NFTs[tokenId].Uri = string(abi.encodePacked(baseURI, Uri , ".png"));

            _tokenIds.increment(); // Define the TokenId


            emit minted(tokenId, msg.sender, NFTs[tokenId].Uri);
        }

        function safeTransferFrom(
            address from,
            address to,
            uint256 tokenId,
            bytes memory _data
        ) public virtual override {
            require(NFTs[tokenId].unlocked == true , "NFT must be unlocked to be sent");
            require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");
            _safeTransfer(from, to, tokenId, _data);
        }   

        function safeTransferFrom(
            address from,
            address to,
            uint256 tokenId
        ) public virtual override {
            require(NFTs[tokenId].unlocked == true , "NFT must be unlocked to be sent");
            safeTransferFrom(from, to, tokenId, "");
        }

        function transferFrom(
            address from,
            address to,
            uint256 tokenId
        ) public virtual override {
            require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");
            require(NFTs[tokenId].unlocked == true , "NFT must be unlocked to be sent");

            _transfer(from, to, tokenId);
            }

        function unlock(uint Id, string memory _str) unlocked(Id) external {
            
            require(key[Id] == uint(keccak256(((abi.encodePacked(_str))))));
            NFTs[Id].unlocked = true;
            _approve(msg.sender,Id);

            emit transferUnlocked(msg.sender, Id);
        }

        function addPassword(string memory _str) external onlyOwner{
            key.push(uint(keccak256(abi.encodePacked(_str))));

            emit passwordAdd();
        }

        function getUri(uint tokenNumber) public view returns(string memory){
            return NFTs[tokenNumber].Uri;
        }

        function getPassword(uint index) external view onlyOwner returns(uint){
            return key[index];
        }

        function getTokenId(uint tokenNumber) public view returns(uint){
            return NFTs[tokenNumber].idToken;
        }

    }