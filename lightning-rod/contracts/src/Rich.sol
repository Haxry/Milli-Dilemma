// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {euint256, ebool, e} from "@inco/lightning/src/Lib.sol";

contract RichestComparison {
    using e for euint256;
    using e for ebool;
    using e for uint256;
    using e for bytes;

    address public alice;
    address public bob;
    address public eve;

    mapping(address => euint256) public encryptedBalances;
    euint256 public richestIndex; // 0 = Alice, 1 = Bob, 2 = Eve
    uint256 public richIndex;

    constructor(address _alice, address _bob, address _eve) {
        alice = _alice;
        bob = _bob;
        eve = _eve;
    }

    function submitEncryptedBalance(bytes memory valueInput) external {
        require(msg.sender == alice || msg.sender == bob || msg.sender == eve, "Not a valid participant");

        euint256 value = valueInput.newEuint256(msg.sender);
        value.allowThis();
        encryptedBalances[msg.sender] = value;
    }

    function compare() public {
        euint256 a = encryptedBalances[alice];
        euint256 b = encryptedBalances[bob];
        euint256 ev = encryptedBalances[eve];

        ebool aliceBeatsBob = a.gt(b); 
          // 0=Alice 1=bob 2=Eve
        euint256 result = uint256(0).asEuint256(); 

        result = e.select(aliceBeatsBob, result, uint256(1).asEuint256());

        ebool currentIsBob = result.eq(uint256(1).asEuint256());
        ebool eveBeatsCurrent = e.select(currentIsBob, ev.gt(b), ev.gt(a));

        result = e.select(eveBeatsCurrent, uint256(2).asEuint256(), result); 
        richestIndex = result;
       richestIndex.allowThis();
        result.allowThis();
    }

    function revealWinner() public {
        richestIndex.requestDecryption(this.winnerCallback.selector, "");
    }

    function winnerCallback(uint256, uint256 result, bytes memory) external {
        if (result == 0) {
            richIndex = 0;
        } else if (result == 1) {
            richIndex = 1;
        } else if (result == 2) {
            richIndex = 2;
        }
        
    }
}
