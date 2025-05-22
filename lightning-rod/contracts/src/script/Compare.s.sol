// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";

interface IRichestComparison {
    function compare() external;
    function richIndex() external view returns (uint256);
}

contract CallCompare is Script {
    IRichestComparison constant rc = IRichestComparison(0x71582639b5Da884f1283eb8752c102D9b09E6731);

    function run() external {
        vm.startBroadcast();
        //rc.compare();
       uint256 richindex = rc.richIndex();
        console.log("Richest index: ", richindex);
        vm.stopBroadcast();
    }
}
