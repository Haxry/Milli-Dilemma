// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import {RichestComparison} from "../Rich.sol";

contract DeployRichestComparison is Script {
    address alice = 0x372610Bdcfa0531B40C8b27bb22A4e198eF04604;
    address bob = 0xcFff80fB428E009Bef190F13b93a37f36E0405bF;
    address eve = 0x09fb7AFfbbf5622e7DaBcB621EAD61b7730ed111;

    function run() external {
        vm.startBroadcast();
        RichestComparison richestComparison = new RichestComparison(alice, bob, eve);
        vm.stopBroadcast();
    }
}
