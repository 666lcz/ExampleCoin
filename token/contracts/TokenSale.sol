// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

import "./Token.sol";

contract TokenSale {
    address private _admin;
    Token public tokenContract;
    uint public tokenPrice;

    constructor(Token _tokenContract, uint _tokenPrice) public {
        _admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }
}

