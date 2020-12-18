// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

import "./Token.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract TokenSale {
    using SafeMath for uint256;

    address private _admin;
    Token public tokenContract;
    uint public tokenPrice;
    uint public tokenSold;

    event Sell(address _buyer, uint _amount);

    constructor(Token _tokenContract, uint _tokenPrice) public {
        _admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

    function buyTokens(uint _numTokens) public payable {
        require(msg.value == _numTokens.mul(tokenPrice));
        require(tokenContract.balanceOf(address(this)) >= _numTokens);
        require(tokenContract.transfer(msg.sender, _numTokens));
        tokenSold += _numTokens;
        
        emit Sell(msg.sender, _numTokens);
    }
}

