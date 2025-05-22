// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";

interface IRichestComparison {
    function compare() external;
    function richIndex() external view returns (uint256);
}

contract CallCompare is Script {
    IRichestComparison constant rc = IRichestComparison(0x2cD21d84330C03c7125D1e9a2110C8329a21Cd4c);

    function run() external {
        vm.startBroadcast();
        //rc.compare();
       uint256 richindex = rc.richIndex();
        console.log("Richest index: ", richindex);
        vm.stopBroadcast();
    }
}
