// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {RichestComparison} from "../Rich.sol";
import {IncoTest} from "@inco/lightning/src/test/IncoTest.sol";
import {GWEI} from "@inco/shared/src/TypeUtils.sol"; 

contract TestRichestComparison is IncoTest {
    RichestComparison richestComparison;

    function setUp() public override {
        
        super.setUp();
        richestComparison = new RichestComparison(alice, bob, eve);
    }

    function testRichestComparison() public {
        vm.prank(alice);
        richestComparison.submitEncryptedBalance(fakePrepareEuint256Ciphertext(20 * GWEI));
        vm.prank(bob);
        richestComparison.submitEncryptedBalance(fakePrepareEuint256Ciphertext(5 * GWEI));
        vm.prank(eve);
        richestComparison.submitEncryptedBalance(fakePrepareEuint256Ciphertext(25 * GWEI));
        richestComparison.compare();
        processAllOperations();

        uint256 decryptedRichestIndex = getUint256Value(richestComparison.richestIndex());
        assertEq(decryptedRichestIndex, 2); 
    }
}
