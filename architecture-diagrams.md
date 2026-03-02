# Mable Banking Service - Architecture Diagrams

## ASCII Architecture (Simple View)

```
┌──────────────────────────────────────────────────────────────┐
│                     BANKING SYSTEM                            │
│                                                                │
│  CLI (index.ts)                                               │
│       │                                                        │
│       ▼                                                        │
│  ┌─────────────────────────────────┐                         │
│  │   BankingService (Orchestrator)  │                         │
│  └──────────┬───────────────────────┘                         │
│             │                                                  │
│    ┌────────┼────────┬──────────┬──────────┐                 │
│    ▼        ▼        ▼          ▼          ▼                 │
│  ┌─────┐ ┌─────┐ ┌──────┐ ┌─────────┐ ┌──────────┐         │
│  │ CSV │ │ Acct│ │Trans │ │ Report  │ │Validator │         │
│  │ Svc │ │ Svc │ │ Svc  │ │ Service │ │ + Mapper │         │
│  └──┬──┘ └──┬──┘ └───┬──┘ └────┬────┘ └─────┬────┘         │
│     │       │        │         │            │                │
│     ▼       ▼        ▼         ▼            ▼                │
│  ┌──────────────────────────────────────────────┐           │
│  │          DOMAIN LAYER                         │           │
│  │   Account[]     Transfer[]    TransferResult │           │
│  │   (Map)                                       │           │
│  └──────────────────────────────────────────────┘           │
│                                                                │
│  INPUT:  accounts.csv, transfers.csv                          │
│  OUTPUT: updated-accounts.csv, failures.log                   │
└──────────────────────────────────────────────────────────────┘
```

---

## Processing Flow

```
1. LOAD
   └─> CSV files → Validators → Mappers → Domain objects

2. PROCESS
   └─> TransferService.processTransfers(AccountsService)
       ├─> Validate transfer
       ├─> Check accounts exist
       ├─> Debit source (with rollback on failure)
       └─> Credit destination

3. OUTPUT
   └─> ReportingService
       ├─> Console summary
       ├─> Write updated account balances
       └─> Write failure logs
```

---

## Mermaid Diagrams (For Professional Rendering)

### Architecture Overview

```mermaid
graph TB
    CLI[CLI Entry Point<br/>index.ts]

    CLI --> BS[BankingService<br/>Orchestrator]

    BS --> CSV[CsvService<br/>File I/O]
    BS --> AS[AccountsService<br/>Account Management]
    BS --> TS[TransferService<br/>Transfer Processing]
    BS --> RS[ReportingService<br/>Output Generation]

    CSV --> VAL[Validators<br/>Input Validation]
    CSV --> MAP[Mappers<br/>CSV → Domain]

    AS --> ACCT[Account Domain<br/>debit/credit logic]
    TS --> TRANS[Transfer Domain<br/>validation rules]

    TS --> RESULT[TransferResult<br/>success/failure tracking]

    VAL --> ACCTVAL[AccountValidator]
    VAL --> TRANSVAL[TransferValidator]

    MAP --> ACCTMAP[AccountCsvRowMapper]
    MAP --> TRANSMAP[TransferCsvRowMapper]

    style BS fill:#4a9eff,stroke:#333,stroke-width:2px,color:#000
    style ACCT fill:#ff6b6b,stroke:#333,stroke-width:2px,color:#fff
    style TRANS fill:#ff6b6b,stroke:#333,stroke-width:2px,color:#fff
    style RESULT fill:#ff6b6b,stroke:#333,stroke-width:2px,color:#fff
    style CLI fill:#95a5a6,stroke:#333,stroke-width:2px,color:#000
```

---

### Data Flow Sequence

```mermaid
sequenceDiagram
    participant CLI
    participant BankingService
    participant CsvService
    participant AccountsService
    participant TransferService
    participant ReportingService

    CLI->>BankingService: run(accountsFile, transfersFile)

    Note over BankingService: PHASE 1: LOAD
    BankingService->>CsvService: load accounts.csv
    CsvService-->>BankingService: AccountCsvRow[]
    BankingService->>AccountsService: new(AccountCsvRow[])
    Note over AccountsService: Build Map<accountNumber, Account>

    BankingService->>CsvService: load transfers.csv
    CsvService-->>BankingService: TransferCsvRow[]
    BankingService->>TransferService: new(TransferCsvRow[])
    Note over TransferService: Build Transfer[]

    Note over BankingService: PHASE 2: PROCESS
    BankingService->>TransferService: processTransfers(AccountsService)

    loop For each transfer
        TransferService->>TransferService: validate()
        TransferService->>AccountsService: hasAccount(from)
        TransferService->>AccountsService: hasAccount(to)
        TransferService->>AccountsService: debit(from, amount)
        alt Debit succeeds
            TransferService->>AccountsService: credit(to, amount)
            alt Credit fails
                TransferService->>AccountsService: credit(from, amount) [ROLLBACK]
            end
        end
    end

    Note over BankingService: PHASE 3: OUTPUT
    BankingService->>ReportingService: displaySummary(success, failure)
    BankingService->>ReportingService: writeAccountBalances(...)
    BankingService->>ReportingService: writeFailureLogs(...)
    ReportingService-->>CLI: Complete
```

---

### Layer Architecture

```mermaid
graph TD
    subgraph "Presentation Layer"
        CLI[CLI<br/>index.ts]
    end

    subgraph "Application Layer"
        BS[BankingService<br/>Orchestrator]
    end

    subgraph "Service Layer"
        CSV[CsvService]
        AS[AccountsService]
        TS[TransferService]
        RS[ReportingService]
    end

    subgraph "Infrastructure Layer"
        VAL[Validators]
        MAP[Mappers]
    end

    subgraph "Domain Layer"
        ACCT[Account<br/>debit/credit]
        TRANS[Transfer<br/>validate]
        RESULT[TransferResult]
    end

    CLI --> BS
    BS --> CSV
    BS --> AS
    BS --> TS
    BS --> RS

    CSV --> VAL
    CSV --> MAP

    AS --> ACCT
    TS --> TRANS
    TS --> RESULT

    style CLI fill:#95a5a6,stroke:#333,stroke-width:2px,color:#000
    style BS fill:#4a9eff,stroke:#333,stroke-width:2px,color:#000
    style CSV fill:#f39c12,stroke:#333,stroke-width:2px,color:#000
    style AS fill:#f39c12,stroke:#333,stroke-width:2px,color:#000
    style TS fill:#f39c12,stroke:#333,stroke-width:2px,color:#000
    style RS fill:#f39c12,stroke:#333,stroke-width:2px,color:#000
    style ACCT fill:#ff6b6b,stroke:#333,stroke-width:2px,color:#fff
    style TRANS fill:#ff6b6b,stroke:#333,stroke-width:2px,color:#fff
    style RESULT fill:#ff6b6b,stroke:#333,stroke-width:2px,color:#fff
```

---
