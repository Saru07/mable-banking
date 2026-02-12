# Mable Banking Service

A TypeScript-based payment processing system that handles account transfers with validation, error handling, and failure logging.

## Features

- ✅ Process bulk transfers from CSV files
- ✅ Account balance validation
- ✅ Comprehensive error handling
- ✅ Failed transaction logging
- ✅ Updated account balances output

## Setup

```bash
npm install
npm run build
```
## Usage

```bash
npm run dev <accounts-file> <transfers-file> [output-file] [failures-log]
```
### Default output files:
- output/mable-balances.csv
- output/transfer-failures.log

### Example
```bash
npm run dev data/mable-accounts.csv data/mable-transfers.csv
```

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test Account.test.ts
```

## Input Format
### Accounts CSV
```
accountNumber,balance
1111234522226789,5000.00
1212343433335665,1200.00
```

### Transfers CSV
```
sourceAccount,destinationAccount,amount
1111234522226789,1212343433335665,500.00
3212343433335755,1111234522226789,320.50
```

## Output

### Console
```bash
📂 Loading accounts...
✅ Loaded 5 records from data/mable-accounts.csv
📂 Loading transfers...
✅ Loaded 6 records from data/mable-transfers.csv

🔄 Processing transfers...
✅ Success: 3 | ❌ Failed: 3
✅ Complete!
```

### Files
- output/account.csv - Updated account balances
- output/transfer-failures.log - Failed transactions with error details


# System Assumptions

## 1. Input Files

### Accounts CSV
- No headers
- Format: `accountNumber,balance`
- Account number: 16 digits
- Balance: non-negative decimal
- UTF-8 encoded

### Transfers CSV
- No headers
- Format: `fromAccountNumber,toAccountNumber,amount`
- Account numbers: 16 digits each
- Amount: positive decimal
- UTF-8 encoded

---

## 2. Business Rules

### Accounts
- Balance cannot go below zero
- Account numbers must be unique
- No maximum balance limit

### Transfers
- Amount must be greater than zero
- Cannot transfer to same account
- Both accounts must exist
- Source must have sufficient funds
- Processed sequentially in file order
- Failed transfers do not affect previous successful transfers

---

## 3. Processing

### Execution Flow
1. Load accounts → validate → build account registry
2. Load transfers → validate
3. Execute transfers sequentially
4. Generate results
5. Display summary and log failures
6. Write final account state

### Error Handling
- **Fatal errors** (program exits):
  - File not found
  - CSV parsing errors
  - Invalid file format
  
- **Non-fatal errors** (logged, processing continues):
  - Invalid transfer (insufficient funds, account not found, etc.)
  - Duplicate accounts (skip duplicates)

- Duplicate account numbers in the input file are skipped (first occurrence is used)
- Failed transfers are logged to `output/transfer-failures.log`

### Transaction Model
- No rollback
- In-memory only
- Single-threaded sequential processing

---

## 4. Architecture

### BankingService
- Performs one function: **process transfers**
- If new functionality needed (e.g., account creation, balance inquiry), extend with menu system or additional methods
- Current scope: transaction processing only

### External Entities
- **Company**: External entity triggering operations via CLI
- Not represented as a domain object in the system
- CLI acts as the company's interface to the banking system

### Layer Responsibilities
- **index.ts**: CLI entry point (parse args only)
- **BankingService**: Application orchestrator
- **Services**: AccountsService, TransferService, ReportingService, CsvService
- **Domain**: Account, Transfer, TransferResult
- **Validators**: Per-entity validation logic

---

## 5. Output

### Updated Accounts CSV
- Same format as input
- Reflects all successful transfers
- Default: `output/accounts.csv`

### Failure Log
- CSV format: `fromAccountNumber,toAccountNumber,amount,errorMessage`
- Created only if failures exist
- Default: `output/transfer-failures.log`

### Console
- Summary: success/failure counts
- Minimal processing logs
- Clear error messages for fatal errors
- Account number is considered as PII and hence is not logged to the console

---

## 6. Technical

- Node.js + TypeScript
- Native modules only (fs, readline, path)
- In-memory processing
- No external database
- Dataset size: hundreds to thousands of records
