import { Account } from '../domain/Account';
import { Result } from '../types/Results';

export interface IAccountsService {
  getAccount(accountNumber: string): Account | undefined;
  hasAccount(accountNumber: string): boolean;
  getAccountCount(): number;
  debit(accountNumber: string, amount: number): Result;
  credit(accountNumber: string, amount: number): Result;
  exportAccounts(): string[][];
}
