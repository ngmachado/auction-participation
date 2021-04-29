// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract SuperERC721 is ERC721, AccessControl {

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    string public TOKEN_URI;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor(string memory name, string memory symbol, string memory uniqueTokenURI) ERC721 (name, symbol)  public {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender); 
        TOKEN_URI = uniqueTokenURI;
    }

    function mint(address to) public returns(uint256 tokenId) {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender) || 
            hasRole(MINTER_ROLE, msg.sender),
            "Not a minter role user"
        );

        _tokenIds.increment();
        tokenId = _tokenIds.current();
        _mint(to, tokenId);
    }

    function multiMint(address to, uint256 howMany) public {
        for(uint256 i = 0; i < howMany; i++) {
            mint(to);
        }
    }

    function multiSend(address[] memory to, uint256[] memory tokensIds) public {
        require(to.length == tokensIds.length, "Count of addresses and tokenIds don't match");
        for(uint256 i = 0; i < tokensIds.length; i++) {
            safeTransferFrom(msg.sender, to[i], tokensIds[i]);
        }
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return TOKEN_URI;
    }
}
