# Banking Service - Design Decisions

## Architecture Overview

This system uses a **layered architecture** with clear separation of concerns:

- **Presentation Layer**: CLI entry point
- **Application Layer**: BankingService orchestrator  
- **Service Layer**: Business logic services (AccountsService, TransferService, CsvService, ReportingService)
- **Domain Layer**: Core entities (Account, Transfer, TransferResult)
- **Infrastructure Layer**: Validators and Mappers

This separation makes the system testable, maintainable, and extensible.

---

## Key Technical Decisions

### 1. Map<string, Account> for Account Storage

Used `Map<accountNumber, Account>` instead of `Array<Account>`.

**Rationale:**
- O(1) lookup performance vs O(n) for arrays
- Each transfer requires two account lookups (source and destination)
- With thousands of transfers, this provides significant performance improvement
- Account numbers are unique identifiers, making them ideal map keys

---

### 2. Result Type Pattern for Error Handling

```typescript
type Result = 
  | { state: 'success' }
  | { state: 'failure'; errorMessage: string }
```

**Rationale:**
- Explicit error handling without exceptions
- Type-safe - compiler enforces result checking
- Makes error cases visible in the code
- Functional programming pattern that works well for validation flows
- Prevents unhandled errors

---

### 3. Transaction Rollback Logic

Implemented rollback mechanism when credit fails after successful debit.

**Rationale:**
- Ensures atomicity - both operations succeed or neither does
- Prevents money from disappearing from source without appearing in destination
- Maintains data integrity
- Critical for financial systems

---

### 4. Domain-Driven Design

Account and Transfer are rich domain objects with behavior, not just data containers.

**Rationale:**
- Business rules live with the data they affect
- `Account.debit()` and `Account.credit()` encapsulate validation and logic
- `Transfer.validate()` checks business rules
- Avoids anemic domain model anti-pattern
- Makes domain logic explicit and testable

---

### 5. Interface-Based Services

All services implement interfaces (IAccountsService, ITransferService, ICsvService).

**Rationale:**
- Enables dependency injection
- Makes testing easier (can mock interfaces)
- Follows dependency inversion principle
- Allows swapping implementations without changing dependent code
- Improves maintainability

---

### 6. Separation of Validation and Mapping

Validators check format, Mappers transform data.

**Rationale:**
- Fail fast on invalid input
- Clear separation of concerns
- Validators know nothing about domain models
- Mappers assume data is already validated
- Clean transformation layer

---

### 7. Multiple Validation Layers

Three distinct validation layers:

1. **CSV Validation** (Validators): Format checks (16 digits, non-negative numbers)
2. **Domain Validation** (Transfer.validate()): Business rules (amount > 0, from ≠ to)
3. **Service Validation** (TransferService): Runtime checks (accounts exist, sufficient funds)

**Rationale:**
- Defense in depth
- Each layer has specific responsibility
- Catches errors at appropriate boundaries
- Clear error messages at each level

---

### 8. Sequential Processing

Transfers are processed sequentially, not concurrently.

**Rationale:**
- Simpler implementation
- No race conditions or locking required
- Sufficient for stated dataset size (hundreds to thousands of records)
- Architecture supports adding concurrency later if needed
- Premature optimization avoided

---

## Trade-offs

### Optimized For:
- **Correctness**: Multiple validation layers, rollback logic, type safety
- **Readability**: Clear naming, simple control flow, well-documented
- **Testability**: Interfaces, dependency injection, isolated layers
- **Maintainability**: Separation of concerns, SOLID principles

### Not Optimized For:
- **Concurrency**: Sequential processing only
- **Persistence**: In-memory storage only
- **Scale**: Thousands of records, not millions
- **Real-time**: Batch processing model

These trade-offs align with the stated requirements and scope.

---

## Design Choices Based on Requirements

### Company as External Entity

The "company" mentioned in requirements is treated as an external entity, not a domain object.

**Rationale:**
- Company provides input files via CLI
- No company-specific business logic required
- Keeps domain model focused
- This design supports multiple companies in the sense that this can be revoked multiple times for different companies with the respective input files.

### Account Numbers as PII

Account numbers are treated as Personally Identifiable Information.

**Rationale:**
- Not logged to console output
- Only written to secure failure logs
- Follows privacy best practices
- Appropriate for financial data

### Failed Transactions Logged

All failed transfers are logged to a separate file.

**Rationale:**
- Essential for auditing
- Helps identify patterns or systemic issues
- Provides transparency
- Business requirement for financial systems

---

## Extensibility Considerations

The architecture supports future extensions:

### Database Persistence
- Replace Map with database repository
- Add repository interface
- Service layer remains unchanged

### Concurrency Support  
- Add worker queue
- Implement account-level locking
- Add idempotency with transfer IDs

### API Layer
- Add REST API on top of BankingService
- BankingService becomes application service
- No changes to domain layer

### Event Sourcing
- Store events (AccountDebited, AccountCredited)
- Build current state from events
- Enhanced audit trail

---

## Testing Strategy

### Unit Tests
- Domain models: Account debit/credit, Transfer validation
- Services: AccountsService, TransferService operations
- Validators: Edge cases and invalid inputs
- Mappers: CSV parsing

### Integration Tests
- Full flow: CSV input → processing → output
- Error scenarios: missing accounts, insufficient funds
- File I/O: actual CSV reading and writing

### Property-Based Testing (Future)
- Invariants: Money conservation (total balance unchanged)
- Random transfer sequences
- Discover edge cases automatically

---

## Technical Debt & Future Improvements

### Would Add for Production:
- Structured logging (Winston) with log levels
- Metrics collection (transfer rates, success/failure rates)
- Monitoring and alerting
- Configuration management
- Health check endpoints
- More granular error types

### Would Consider Differently:
- Event sourcing from the start if stricter audit requirements
- Streaming for very large files
- More explicit error types beyond string messages

These are refinements rather than fundamental changes - the core architecture is sound.
