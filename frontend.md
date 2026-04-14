# 🎨 PayFlow Frontend Design Specification (One-Shot UI)

## 🧠 Overview

Build a **modern, premium fintech UI** for PayFlow — a programmable payroll system.

The UI must feel:

* Clean
* Futuristic
* Professional
* High-quality (like Stripe / Linear)

Use:

* Dark mode
* Glassmorphism
* Smooth animations
* Minimal layout

---

# 🎯 DESIGN STYLE

## Theme:

Modern Fintech + Glassmorphism + Dark UI

## Visual Feel:

* Soft glow
* Transparent cards
* Rounded corners
* Subtle gradients
* Smooth transitions

---

# 🎨 COLOR SYSTEM

## Background:

* Primary: #0B0F19
* Secondary: #121826

## Accent Colors:

* Blue: #4F8CFF
* Purple: #7C5CFF
* Gradient: Blue → Purple

## Status Colors:

* Success: #22C55E
* Warning: #F59E0B
* Error: #EF4444

## Text:

* Primary: #FFFFFF
* Secondary: #A1A1AA

---

# 🔤 TYPOGRAPHY

Font: Inter (preferred)

Sizes:

* Heading: 28–36px (bold)
* Subheading: 18–22px
* Body: 14–16px

---

# 🧩 CORE COMPONENTS

## 1. Glass Card

Style:

* Background: rgba(255,255,255,0.05)
* Backdrop blur
* Border radius: 16px
* Border: subtle (rgba white 0.1)
* Soft shadow

---

## 2. Buttons

Primary:

* Gradient background (blue → purple)
* White text
* Rounded (12px)
* Hover: glow effect

Secondary:

* Transparent
* Border outline
* Subtle hover fill

---

## 3. Input Fields

* Dark background
* Rounded corners
* Focus glow (blue)
* Placeholder text dim

---

## 4. Status Badges

* Rounded pill style
* Small font
* Colors:

  * Scheduled → yellow
  * Funded → blue
  * Redeemed → green

---

# 📱 PAGES TO BUILD

---

# 🧑‍💼 1. Employer Dashboard

## Layout:

* Left sidebar
* Main content area

## Sidebar:

* Logo (PayFlow)
* Menu:

  * Dashboard
  * Payrolls
  * Employees

## Main Section:

### Top Header:

* Title: “Payroll Dashboard”
* Button: “Create Payroll”

---

### Payroll Summary Cards:

* Total Employees
* Total Payroll Amount
* Status

---

### Employee Table:

Columns:

* Name
* Email
* Salary
* Status badge

---

---

# 📄 2. Salary Slip (PDF Style UI)

Design like:

* Apple invoice / Stripe receipt

## Layout:

* White card on dark background

## Sections:

* Company name
* Employee name
* Salary breakdown
* BIG amount (center)

Example:
“500 USDC” (large, bold)

---

### Bottom Section:

* QR code
* Button: “Claim Salary”

---

---

# 💰 3. Redeem Page (MOST IMPORTANT)

## Layout:

Centered card

---

### Top:

Title:
“Salary Voucher”

---

### Main Card:

* Big amount (VERY LARGE)
* Text:
  “Available to Claim”

---

### Input:

* Placeholder:
  “Enter wallet address”

---

### Buttons:

Primary:

* “Claim Salary”

Secondary:

* “Use my wallet”

---

---

# ✨ ANIMATIONS (IMPORTANT)

## Add:

### 1. Button Hover:

* Glow effect

### 2. Page Load:

* Fade + slight scale

### 3. Claim Action:

* Loading spinner

### 4. Success:

* Checkmark animation
* Optional confetti

### 5. Amount Animation:

* Count up (0 → amount)

---

# 🧠 UX DETAILS

* Keep layout minimal
* Focus on clarity
* Avoid clutter
* Use whitespace generously

---

# ⚡ RESPONSIVENESS

* Mobile friendly
* Stack layout vertically
* Keep buttons full-width on mobile

---

# 🚀 FINAL INSTRUCTION

Build a **complete frontend UI** with:

* Dashboard
* Salary slip view
* Redeem page

Use:

* Clean component structure
* Reusable styles
* Smooth interactions

The UI must feel like a **real fintech startup product**, not a basic project.
