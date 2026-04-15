// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/**
 * @title PayFlowPayroll
 * @notice Programmable payroll contract on Arc (USDC-native chain).
 *         Employers create payrolls, deposit USDC (native), and distribute
 *         salaries to employee embedded wallets (Circle).
 *
 * Flow:
 *   1. Employer calls createPayroll() with employee wallets + amounts
 *   2. Employer calls fundPayroll() sending exact USDC (native value)
 *   3. At payout time, distribute() sends USDC to each employee wallet
 *   4. Employees claim from their embedded wallets via the frontend
 */
contract PayFlowPayroll {
    // ─── State ───

    address public owner;
    uint256 public nextPayrollId;

    struct Payroll {
        address employer;
        uint256 totalAmount;
        uint256 payoutDate;
        uint256 employeeCount;
        bool isFunded;
        bool isDistributed;
    }

    struct Payment {
        address wallet;
        uint256 amount;
        bool isPaid;
    }

    mapping(uint256 => Payroll) public payrolls;
    mapping(uint256 => Payment[]) internal _payments;
    mapping(uint256 => uint256) public deposits;

    // ─── Events ───

    event PayrollCreated(
        uint256 indexed payrollId,
        address indexed employer,
        uint256 totalAmount,
        uint256 payoutDate,
        uint256 employeeCount
    );

    event PayrollFunded(uint256 indexed payrollId, uint256 amount);

    event SalaryPaid(
        uint256 indexed payrollId,
        address indexed employee,
        uint256 amount
    );

    event PayrollDistributed(uint256 indexed payrollId);

    event FundsWithdrawn(uint256 indexed payrollId, address indexed employer, uint256 amount);

    // ─── Modifiers ───

    modifier onlyOwner() {
        require(msg.sender == owner, "PayFlow: not owner");
        _;
    }

    modifier onlyEmployer(uint256 payrollId) {
        require(payrolls[payrollId].employer == msg.sender, "PayFlow: not employer");
        _;
    }

    // ─── Constructor ───

    constructor() {
        owner = msg.sender;
    }

    // ─── Core Functions ───

    /**
     * @notice Create a new payroll with employee wallets and salary amounts.
     * @param wallets  Array of employee embedded wallet addresses (Circle).
     * @param amounts  Array of salary amounts in USDC (18 decimals on Arc).
     * @param payoutDate  Unix timestamp when distribution is allowed.
     * @return payrollId  The ID of the created payroll.
     */
    function createPayroll(
        address[] calldata wallets,
        uint256[] calldata amounts,
        uint256 payoutDate
    ) external returns (uint256 payrollId) {
        require(wallets.length == amounts.length, "PayFlow: length mismatch");
        require(wallets.length > 0, "PayFlow: empty payroll");
        require(payoutDate > 0, "PayFlow: invalid date");

        payrollId = nextPayrollId++;
        uint256 total = 0;

        for (uint256 i = 0; i < wallets.length; i++) {
            require(wallets[i] != address(0), "PayFlow: zero address");
            require(amounts[i] > 0, "PayFlow: zero amount");
            total += amounts[i];

            _payments[payrollId].push(Payment({
                wallet: wallets[i],
                amount: amounts[i],
                isPaid: false
            }));
        }

        payrolls[payrollId] = Payroll({
            employer: msg.sender,
            totalAmount: total,
            payoutDate: payoutDate,
            employeeCount: wallets.length,
            isFunded: false,
            isDistributed: false
        });

        emit PayrollCreated(payrollId, msg.sender, total, payoutDate, wallets.length);
    }

    /**
     * @notice Fund a payroll by sending USDC (native on Arc).
     *         Must send at least the totalAmount.
     */
    function fundPayroll(uint256 payrollId) external payable onlyEmployer(payrollId) {
        Payroll storage p = payrolls[payrollId];
        require(!p.isFunded, "PayFlow: already funded");
        require(msg.value >= p.totalAmount, "PayFlow: insufficient USDC");

        p.isFunded = true;
        deposits[payrollId] = msg.value;

        // Refund excess if overpaid
        uint256 excess = msg.value - p.totalAmount;
        if (excess > 0) {
            deposits[payrollId] = p.totalAmount;
            (bool refunded, ) = msg.sender.call{value: excess}("");
            require(refunded, "PayFlow: refund failed");
        }

        emit PayrollFunded(payrollId, p.totalAmount);
    }

    /**
     * @notice Distribute salaries to all employee wallets.
     *         Can be called by the employer or the contract owner (scheduler).
     *         Only works after payoutDate and when funded.
     */
    function distribute(uint256 payrollId) external {
        Payroll storage p = payrolls[payrollId];
        require(
            msg.sender == p.employer || msg.sender == owner,
            "PayFlow: not authorized"
        );
        require(p.isFunded, "PayFlow: not funded");
        require(!p.isDistributed, "PayFlow: already distributed");
        require(block.timestamp >= p.payoutDate, "PayFlow: too early");

        Payment[] storage payments = _payments[payrollId];

        for (uint256 i = 0; i < payments.length; i++) {
            if (!payments[i].isPaid) {
                payments[i].isPaid = true;
                (bool sent, ) = payments[i].wallet.call{value: payments[i].amount}("");
                require(sent, "PayFlow: transfer failed");
                emit SalaryPaid(payrollId, payments[i].wallet, payments[i].amount);
            }
        }

        p.isDistributed = true;
        deposits[payrollId] = 0;

        emit PayrollDistributed(payrollId);
    }

    /**
     * @notice Employer can withdraw funds if payroll is funded but NOT yet distributed.
     *         Safety mechanism for cancellations.
     */
    function withdrawFunds(uint256 payrollId) external onlyEmployer(payrollId) {
        Payroll storage p = payrolls[payrollId];
        require(p.isFunded, "PayFlow: not funded");
        require(!p.isDistributed, "PayFlow: already distributed");

        uint256 amount = deposits[payrollId];
        require(amount > 0, "PayFlow: no funds");

        deposits[payrollId] = 0;
        p.isFunded = false;

        (bool sent, ) = msg.sender.call{value: amount}("");
        require(sent, "PayFlow: withdraw failed");

        emit FundsWithdrawn(payrollId, msg.sender, amount);
    }

    // ─── View Functions ───

    /**
     * @notice Get all payments for a payroll.
     */
    function getPayments(uint256 payrollId) external view returns (Payment[] memory) {
        return _payments[payrollId];
    }

    /**
     * @notice Get a single payment by index.
     */
    function getPayment(uint256 payrollId, uint256 index) external view returns (Payment memory) {
        return _payments[payrollId][index];
    }

    /**
     * @notice Check if a specific employee has been paid in a payroll.
     */
    function isEmployeePaid(uint256 payrollId, uint256 index) external view returns (bool) {
        return _payments[payrollId][index].isPaid;
    }

    /**
     * @notice Get total number of payrolls created.
     */
    function getPayrollCount() external view returns (uint256) {
        return nextPayrollId;
    }

    // ─── Admin ───

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "PayFlow: zero address");
        owner = newOwner;
    }

    receive() external payable {}
}
