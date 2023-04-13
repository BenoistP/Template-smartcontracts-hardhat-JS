// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


    contract NFTMaillot_UserMint is ERC721, Ownable {
        using Counters for Counters.Counter;
        Counters.Counter private _Index; 

        constructor(string memory _baseURI) ERC721("Maillot", "MAI"){
            baseURI = _baseURI;
        }

        struct NFT {
            uint idToken;
            string Uri;
        }

        struct User {
            uint mintAuthorized;
        }

        mapping(uint => NFT) public NFTs;
        mapping(address => User) public Users;
        mapping(uint => uint) internal key;
        mapping(uint => string) internal password;

        uint maxSupply = 50;
        string baseURI;

        event minted(uint tokenId, address caller, string Uri);
        event AuthorisationSet(uint keyDelete, address caller);
        event passwordAdd(uint keyNumber);

        function mintNft(uint tokenId) external {
            require(Users[msg.sender].mintAuthorized > 0 , "You are not allowed to mint");

            Users[msg.sender].mintAuthorized --;

            require(tokenId < maxSupply, "Max mint");

            _mint(msg.sender, tokenId);
            NFTs[tokenId].idToken = tokenId;
            NFTs[tokenId].Uri = string(abi.encodePacked(baseURI, tokenId , ".png"));

            emit minted(tokenId, msg.sender, NFTs[tokenId].Uri);
        }

        function setAuthorisation(uint id, string memory _str) external {
            require(key[id] == uint(keccak256(abi.encodePacked(_str))));
            Users[msg.sender].mintAuthorized ++;

            delete  key[id];
            delete  password[id];

            emit AuthorisationSet(id, msg.sender);
        }

        function addPassword(string memory _str) external onlyOwner{
            _Index.increment();
            uint i = _Index.current();

            key[i] = uint(keccak256(abi.encodePacked(_str)));
            password[i] = _str;

            emit passwordAdd(i);
        }

        function getUri(uint tokenNumber) external view returns(string memory){
            return NFTs[tokenNumber].Uri;
        }

        function getKey(uint index) external view onlyOwner returns(uint){
            return key[index];
        }

        function getPassword(uint index) external view onlyOwner returns(string memory){
            return password[index];
        }

        function getTokenId(uint tokenNumber) external view returns(uint){
            return NFTs[tokenNumber].idToken;
        }

        function getAuthorized(address user) external view returns(uint){
            return Users[user].mintAuthorized;
        }


    }