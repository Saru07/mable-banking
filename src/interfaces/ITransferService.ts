import { IAccountsService } from './IAccountsService';

export interface ITransferService {
  processTransfers(accountsService: IAccountsService): void;
  getSuccessCount(): number;
  getFailureCount(): number;
  exportFailureLogs(): string[][];
}
