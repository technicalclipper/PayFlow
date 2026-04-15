# PayFlow Contract Details

## Deployment Info

| Field              | Value                                                              |
| ------------------ | ------------------------------------------------------------------ |
| **Network**        | Arc Testnet (Chain ID: 5042002)                                    |
| **RPC URL**        | `https://rpc.testnet.arc.network`                                  |
| **Contract**       | `0x1BD01e3684ac1555C8089425eDdCB9De39A8f988`                       |
| **Deployer/Owner** | `0xe3A7B6Db1087186503386d423b6851b1f089B9F1`                       |
| **TX Hash**        | `0x73a2fe382d97a0644a824544714f2f6b8139d26b0dfda3cd0ea772e405c21d61` |
| **Explorer**       | `https://testnet.arcscan.app`                                      |
| **Native Token**   | USDC (18 decimals, used for gas + payroll)                         |
| **Solidity**       | 0.8.30                                                             |
| **Faucet**         | `https://faucet.circle.com` (select Arc Testnet)                   |

## Contract ABI (Key Functions)

### Write Functions

```solidity
// Create a payroll with employee wallets and amounts
function createPayroll(
    address[] calldata wallets,
    uint256[] calldata amounts,
    uint256 payoutDate
) external returns (uint256 payrollId)

// Fund a payroll — send USDC (native) as msg.value
function fundPayroll(uint256 payrollId) external payable

// Distribute salaries to employee wallets (only after payoutDate)
function distribute(uint256 payrollId) external

// Withdraw funds before distribution (cancel safety)
function withdrawFunds(uint256 payrollId) external

// Transfer contract ownership
function transferOwnership(address newOwner) external
```

### Read Functions

```solidity
function payrolls(uint256) external view returns (
    address employer,
    uint256 totalAmount,
    uint256 payoutDate,
    uint256 employeeCount,
    bool isFunded,
    bool isDistributed
)

function getPayments(uint256 payrollId) external view returns (Payment[] memory)
// Payment = { address wallet, uint256 amount, bool isPaid }

function getPayment(uint256 payrollId, uint256 index) external view returns (Payment memory)

function isEmployeePaid(uint256 payrollId, uint256 index) external view returns (bool)

function getPayrollCount() external view returns (uint256)

function deposits(uint256 payrollId) external view returns (uint256)

function owner() external view returns (address)

function nextPayrollId() external view returns (uint256)
```

### Events

```solidity
event PayrollCreated(uint256 indexed payrollId, address indexed employer, uint256 totalAmount, uint256 payoutDate, uint256 employeeCount)
event PayrollFunded(uint256 indexed payrollId, uint256 amount)
event SalaryPaid(uint256 indexed payrollId, address indexed employee, uint256 amount)
event PayrollDistributed(uint256 indexed payrollId)
event FundsWithdrawn(uint256 indexed payrollId, address indexed employer, uint256 amount)
```

## Flow

1. **createPayroll** → Employer passes employee wallet addresses + USDC amounts + payout date
2. **fundPayroll** → Employer sends exact USDC (native) via `msg.value`
3. **distribute** → After `payoutDate`, employer or owner triggers payout to all wallets
4. Employees claim from their Circle embedded wallets via the frontend

## Circle Wallet Integration

- Each employee gets a Circle Developer-Controlled embedded wallet on Arc Testnet
- The contract sends USDC to these wallet addresses during `distribute()`
- Employees redeem via the frontend which triggers a Circle wallet transfer to their personal address
- Circle API Key env var: `CIRCLE_API_KEY`
- Circle Entity Secret env var: `CIRCLE_ENTITY_SECRET`
