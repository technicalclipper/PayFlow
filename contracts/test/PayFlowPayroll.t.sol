// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "forge-std/Test.sol";
import "../src/PayFlowPayroll.sol";

contract PayFlowPayrollTest is Test {
    PayFlowPayroll payroll;

    address employer = address(0x1111);
    address emp1 = address(0x2222);
    address emp2 = address(0x3333);
    address emp3 = address(0x4444);

    function setUp() public {
        payroll = new PayFlowPayroll();
        vm.deal(employer, 10000 ether);
    }

    // ─── createPayroll ───

    function testCreatePayroll() public {
        address[] memory wallets = new address[](2);
        wallets[0] = emp1;
        wallets[1] = emp2;

        uint256[] memory amounts = new uint256[](2);
        amounts[0] = 1000 ether;
        amounts[1] = 2000 ether;

        vm.prank(employer);
        uint256 id = payroll.createPayroll(wallets, amounts, block.timestamp + 1 days);

        assertEq(id, 0);
        assertEq(payroll.getPayrollCount(), 1);

        (
            address emp,
            uint256 total,
            uint256 date,
            uint256 count,
            bool funded,
            bool distributed
        ) = payroll.payrolls(id);

        assertEq(emp, employer);
        assertEq(total, 3000 ether);
        assertEq(count, 2);
        assertFalse(funded);
        assertFalse(distributed);
    }

    function testCreatePayrollEmptyReverts() public {
        address[] memory wallets = new address[](0);
        uint256[] memory amounts = new uint256[](0);

        vm.prank(employer);
        vm.expectRevert("PayFlow: empty payroll");
        payroll.createPayroll(wallets, amounts, block.timestamp + 1 days);
    }

    function testCreatePayrollMismatchReverts() public {
        address[] memory wallets = new address[](2);
        wallets[0] = emp1;
        wallets[1] = emp2;

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 1000 ether;

        vm.prank(employer);
        vm.expectRevert("PayFlow: length mismatch");
        payroll.createPayroll(wallets, amounts, block.timestamp + 1 days);
    }

    function testCreatePayrollZeroAddressReverts() public {
        address[] memory wallets = new address[](1);
        wallets[0] = address(0);

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 1000 ether;

        vm.prank(employer);
        vm.expectRevert("PayFlow: zero address");
        payroll.createPayroll(wallets, amounts, block.timestamp + 1 days);
    }

    // ─── fundPayroll ───

    function testFundPayroll() public {
        uint256 id = _createSamplePayroll();

        vm.prank(employer);
        payroll.fundPayroll{value: 3000 ether}(id);

        (, , , , bool funded, ) = payroll.payrolls(id);
        assertTrue(funded);
        assertEq(payroll.deposits(id), 3000 ether);
    }

    function testFundPayrollInsufficientReverts() public {
        uint256 id = _createSamplePayroll();

        vm.prank(employer);
        vm.expectRevert("PayFlow: insufficient USDC");
        payroll.fundPayroll{value: 1000 ether}(id);
    }

    function testFundPayrollRefundsExcess() public {
        uint256 id = _createSamplePayroll();

        uint256 balanceBefore = employer.balance;
        vm.prank(employer);
        payroll.fundPayroll{value: 5000 ether}(id);

        assertEq(payroll.deposits(id), 3000 ether);
        assertEq(employer.balance, balanceBefore - 3000 ether);
    }

    function testFundPayrollDoubleFundReverts() public {
        uint256 id = _createSamplePayroll();

        vm.prank(employer);
        payroll.fundPayroll{value: 3000 ether}(id);

        vm.prank(employer);
        vm.expectRevert("PayFlow: already funded");
        payroll.fundPayroll{value: 3000 ether}(id);
    }

    // ─── distribute ───

    function testDistribute() public {
        uint256 id = _createAndFundPayroll();

        vm.warp(block.timestamp + 1 days);
        vm.prank(employer);
        payroll.distribute(id);

        (, , , , , bool distributed) = payroll.payrolls(id);
        assertTrue(distributed);

        assertEq(emp1.balance, 1000 ether);
        assertEq(emp2.balance, 2000 ether);
    }

    function testDistributeTooEarlyReverts() public {
        uint256 id = _createAndFundPayroll();

        vm.prank(employer);
        vm.expectRevert("PayFlow: too early");
        payroll.distribute(id);
    }

    function testDistributeNotFundedReverts() public {
        uint256 id = _createSamplePayroll();

        vm.warp(block.timestamp + 1 days);
        vm.prank(employer);
        vm.expectRevert("PayFlow: not funded");
        payroll.distribute(id);
    }

    function testDistributeDoubleReverts() public {
        uint256 id = _createAndFundPayroll();

        vm.warp(block.timestamp + 1 days);
        vm.prank(employer);
        payroll.distribute(id);

        vm.prank(employer);
        vm.expectRevert("PayFlow: already distributed");
        payroll.distribute(id);
    }

    function testDistributeByOwner() public {
        uint256 id = _createAndFundPayroll();

        vm.warp(block.timestamp + 1 days);
        payroll.distribute(id);

        assertEq(emp1.balance, 1000 ether);
        assertEq(emp2.balance, 2000 ether);
    }

    function testDistributeByRandomReverts() public {
        uint256 id = _createAndFundPayroll();

        vm.warp(block.timestamp + 1 days);
        vm.prank(address(0xDEAD));
        vm.expectRevert("PayFlow: not authorized");
        payroll.distribute(id);
    }

    // ─── withdrawFunds ───

    function testWithdrawFunds() public {
        uint256 id = _createAndFundPayroll();

        uint256 balanceBefore = employer.balance;
        vm.prank(employer);
        payroll.withdrawFunds(id);

        assertEq(employer.balance, balanceBefore + 3000 ether);

        (, , , , bool funded, ) = payroll.payrolls(id);
        assertFalse(funded);
    }

    function testWithdrawAfterDistributeReverts() public {
        uint256 id = _createAndFundPayroll();

        vm.warp(block.timestamp + 1 days);
        vm.prank(employer);
        payroll.distribute(id);

        vm.prank(employer);
        vm.expectRevert("PayFlow: already distributed");
        payroll.withdrawFunds(id);
    }

    // ─── View Functions ───

    function testGetPayments() public {
        uint256 id = _createSamplePayroll();

        PayFlowPayroll.Payment[] memory payments = payroll.getPayments(id);
        assertEq(payments.length, 2);
        assertEq(payments[0].wallet, emp1);
        assertEq(payments[0].amount, 1000 ether);
        assertFalse(payments[0].isPaid);
        assertEq(payments[1].wallet, emp2);
        assertEq(payments[1].amount, 2000 ether);
    }

    function testGetPayment() public {
        uint256 id = _createSamplePayroll();

        PayFlowPayroll.Payment memory p = payroll.getPayment(id, 0);
        assertEq(p.wallet, emp1);
        assertEq(p.amount, 1000 ether);
    }

    function testIsEmployeePaid() public {
        uint256 id = _createAndFundPayroll();
        assertFalse(payroll.isEmployeePaid(id, 0));

        vm.warp(block.timestamp + 1 days);
        vm.prank(employer);
        payroll.distribute(id);

        assertTrue(payroll.isEmployeePaid(id, 0));
        assertTrue(payroll.isEmployeePaid(id, 1));
    }

    // ─── Events ───

    function testEmitsPayrollCreated() public {
        address[] memory wallets = new address[](1);
        wallets[0] = emp1;
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 500 ether;

        vm.prank(employer);
        vm.expectEmit(true, true, false, true);
        emit PayFlowPayroll.PayrollCreated(0, employer, 500 ether, block.timestamp + 1 days, 1);
        payroll.createPayroll(wallets, amounts, block.timestamp + 1 days);
    }

    function testEmitsSalaryPaid() public {
        uint256 id = _createAndFundPayroll();

        vm.warp(block.timestamp + 1 days);

        vm.prank(employer);
        vm.expectEmit(true, true, false, true);
        emit PayFlowPayroll.SalaryPaid(id, emp1, 1000 ether);
        payroll.distribute(id);
    }

    // ─── Admin ───

    function testTransferOwnership() public {
        payroll.transferOwnership(address(0xBEEF));
        assertEq(payroll.owner(), address(0xBEEF));
    }

    function testTransferOwnershipNotOwnerReverts() public {
        vm.prank(address(0xDEAD));
        vm.expectRevert("PayFlow: not owner");
        payroll.transferOwnership(address(0xBEEF));
    }

    // ─── Multi-payroll ───

    function testMultiplePayrolls() public {
        uint256 id1 = _createSamplePayroll();
        uint256 id2 = _createSamplePayroll();

        assertEq(id1, 0);
        assertEq(id2, 1);
        assertEq(payroll.getPayrollCount(), 2);
    }

    // ─── Helpers ───

    function _createSamplePayroll() internal returns (uint256) {
        address[] memory wallets = new address[](2);
        wallets[0] = emp1;
        wallets[1] = emp2;

        uint256[] memory amounts = new uint256[](2);
        amounts[0] = 1000 ether;
        amounts[1] = 2000 ether;

        vm.prank(employer);
        return payroll.createPayroll(wallets, amounts, block.timestamp + 1 days);
    }

    function _createAndFundPayroll() internal returns (uint256) {
        uint256 id = _createSamplePayroll();
        vm.prank(employer);
        payroll.fundPayroll{value: 3000 ether}(id);
        return id;
    }
}
