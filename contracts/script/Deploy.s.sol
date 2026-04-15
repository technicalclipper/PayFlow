// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "forge-std/Script.sol";
import "../src/PayFlowPayroll.sol";

contract DeployPayFlowPayroll is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerKey);
        PayFlowPayroll payroll = new PayFlowPayroll();
        vm.stopBroadcast();

        console.log("PayFlowPayroll deployed at:", address(payroll));
    }
}
