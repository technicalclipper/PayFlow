💼 PayFlow — Interactive Payroll Vouchers (Embedded Wallet Model)
🧠 Product Definition

PayFlow is a programmable payroll system where:

Employers deposit USDC into Arc
At payout time, salaries are automatically distributed into individual embedded wallets created via Circle
Each employee receives a PDF salary slip
The PDF acts like a voucher interface
Employees enter a wallet address and click Claim
Funds are transferred from their embedded wallet → chosen wallet
🎯 CORE IDEA (VERY IMPORTANT)

Salary is pre-funded into user-specific wallets
PDF is just an access + interaction layer
User chooses where to send the money

⚙️ HIGH-LEVEL ARCHITECTURE
1. Frontend
Employer dashboard
Redeem page (IMPORTANT)
PDF UI (visual only)
2. Backend (Node.js APIs)

Handles:

Payroll creation
Wallet creation
Distribution logic
Redemption logic
PDF generation
Email sending
3. Database (Supabase / Postgres)

Stores:

Employees
Payrolls
Wallet mappings
Redeem tokens
Status
4. Arc
Locks employer funds
Releases funds at payout
5. Circle
Creates embedded wallets per employee
Holds salary funds
Executes transfers
🗄️ DATABASE DESIGN (SUPABASE)
Employees
id
name
email
wallet_id (Circle wallet ID)
created_at
Payrolls
id
payout_date
total_amount
status (scheduled / processed)
Payroll_Employees (IMPORTANT)
id
payroll_id
employee_id
salary_amount
status:
pending
funded
redeemed
Redeem_Tokens
token
employee_id
payroll_id
is_used
expires_at
🔁 COMPLETE FLOW (STEP-BY-STEP)
🧑‍💼 1. Employer Creates Payroll

Employer:

Adds employees (or selects existing)
Assigns salary
Sets payout date

System:

Stores data in Supabase
Calculates total payroll
Marks payroll = scheduled
🔐 2. Employer Deposits Funds
Employer sends USDC → Arc
Funds locked for payroll

👉 Important:
This guarantees payment

🪪 3. Embedded Wallet Creation

For each employee:

System:

Checks if wallet exists
If not:
Create wallet using Circle

Store:

employee → wallet_id mapping

👉 Each employee now has a dedicated wallet

⏳ 4. Scheduler / Agent

Background service runs continuously:

Checks:
current time vs payout_date

When matched:
👉 triggers distribution

⚡ 5. Salary Distribution (CRITICAL STEP)

For each employee:

Transfer:

Arc → Employee Embedded Wallet
Update DB:
status = funded

👉 Now:

Money is already inside employee wallet
No further dependency on employer
📄 6. PDF Generation

For each employee:

Generate salary slip PDF:

Contains:

Employee details
Salary amount
Company info
“Claim Salary” button (visual)
QR code
Secure redeem link

👉 IMPORTANT:
PDF is NOT interactive backend-wise
It redirects to your system

📧 7. Email Delivery
Send PDF to employee email

Message:

“Your salary is ready. Click to claim.”

👩‍💻 8. User Opens PDF

User:

Clicks button OR scans QR

Redirects to:

/redeem/:token
🔍 9. Redeem Page (MOST IMPORTANT UI)

This is the actual working interface

Displays:
Salary amount
Status: AVAILABLE
Input Field:
Enter wallet address
Button:
“Claim Salary”
⚡ 10. Claim Action (CORE LOGIC)

When user clicks Claim:

Backend performs:

Step 1: Validate
Token exists
Not already used
Status = funded
Step 2: Fetch Wallet
Get employee embedded wallet (Circle)
Step 3: Execute Transfer
Embedded Wallet → Entered Wallet Address
Step 4: Update DB
status → redeemed
mark token used
🎉 11. Completion

User sees:

“Salary successfully transferred”

🔐 SECURITY LOGIC

Must enforce:

One-time token usage
Prevent double redemption
Validate wallet address format
Optional:
expiry time
rate limiting
🧠 KEY DESIGN PRINCIPLES
1. No Central Wallet
Each employee has isolated wallet
2. Pre-Funded System
Money already distributed before claim
3. PDF = UX Layer Only
Not storage
Not execution
4. User-Controlled Redemption
User chooses destination wallet
🧪 DEMO FLOW (VERY IMPORTANT)
Show this:
Create payroll
Simulate payout
Show:
👉 employee wallets funded
Open PDF
Click “Claim”
Enter wallet address
Click claim

💥 Funds transferred

🎯 FINAL PITCH

“PayFlow turns salary slips into interactive crypto vouchers by pre-funding embedded wallets on payout, allowing employees to claim their salary to any wallet instantly.”


The order should be:

Step	What	Why
1
Supabase integration (backend + frontend)
Foundation — CRUD for employees, payrolls, redeem tokens
2
Circle integration
Create embedded wallets per employee, execute transfers
3
Arc integration
Lock employer funds, release on payout
4
PDF generation + email
Generate salary slips, send via email
5
Scheduler/agent
Auto-trigger distribution at payout time