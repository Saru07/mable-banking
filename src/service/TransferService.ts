import { ITransferService } from '../interfaces/ITransferService';
import { IAccountsService } from '../interfaces/IAccountsService';
import { Transfer } from '../domain/Transfer';
import { TransferResult } from '../domain/TransferResult';

export class TransferService implements ITransferService {
  private transfers: Transfer[];
  private logs: TransferResult[];

  constructor(records: string[][]) {
    this.transfers = this.buildTransfers(records);
    this.logs = [];
  }

  processTransfers(accountsService: IAccountsService): void {
    this.transfers.forEach(transfer => {
      const transferResult = this.processTransfer(transfer, accountsService);
      this.logs.push(transferResult);
    });
  }

  getSuccessCount(): number {
    return this.logs.filter(log => log.result.state === 'success').length;
  }

  getFailureCount(): number {
    return this.logs.filter(log => log.result.state === 'failure').length;
  }

  exportFailureLogs(): string[][] {
    return this.logs
    .filter(log => log.result.state === 'failure')
    .map(log => [
      log.transfer.fromAccountNumber,
      log.transfer.toAccountNumber,
      log.transfer.amount.toString(),
      log.result.errorMessage ?? ''
    ]);
  }

  private buildTransfers(records: string[][]): Transfer[] {
    return records.map(record => {
      const [from, to, amount] = record;
      return new Transfer(from ?? '', to ?? '', parseFloat(amount ?? ''));
    });
  }

  private processTransfer(transfer: Transfer, accountsService: IAccountsService): TransferResult {
    // 1. Validate transfer business rules
    const validationResult = transfer.validate();
    if (validationResult.state === 'failure') {
      return {
        transfer,
        result: validationResult
      };
    }

    // 2. Check if source account exists
    if (!accountsService.hasAccount(transfer.fromAccountNumber)) {
      return {
        transfer,
        result: { 
          state: 'failure', 
          errorMessage: `Source account ${transfer.fromAccountNumber} does not exist` 
        }
      };
    }

    // 3. Check if destination account exists
    if (!accountsService.hasAccount(transfer.toAccountNumber)) {
      return {
        transfer,
        result: { 
          state: 'failure', 
          errorMessage: `Destination account ${transfer.toAccountNumber} does not exist` 
        }
      };
    }

    // 4. Debit from source
    const debitResult = accountsService.debit(transfer.fromAccountNumber, transfer.amount);
    if (debitResult.state === 'failure') {
      return {
        transfer,
        result: debitResult
      };
    }

    // 5. Credit to destination
    const creditResult = accountsService.credit(transfer.toAccountNumber, transfer.amount);
    if (creditResult.state === 'failure') {
      // Rollback: credit back to source
      accountsService.credit(transfer.fromAccountNumber, transfer.amount);
      return {
        transfer,
        result: creditResult
      };
    }

    // Success
    return {
      transfer,
      result: { state: 'success' }
    };
  }
}
