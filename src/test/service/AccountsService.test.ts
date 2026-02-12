import { AccountsService } from '../../service/AccountsService';
import { AccountCsvRow } from '../../types/CsvRows';

describe('AccountsService', () => {
  describe('constructor', () => {
    it('should initialize with valid account records', () => {
      const records: AccountCsvRow[] = [
        { accountNumber: '1234567890123456', balance: 1000 },
        { accountNumber: '6543210987654321', balance: 500 }
      ];

      const service = new AccountsService(records);

      expect(service.getAccountCount()).toBe(2);
    });

    it('should handle empty records', () => {
      const service = new AccountsService([]);

      expect(service.getAccountCount()).toBe(0);
    });

    it('should skip duplicate account numbers', () => {
      const records: AccountCsvRow[] = [
        { accountNumber: '1234567890123456', balance: 1000 },
        { accountNumber: '1234567890123456', balance: 2000 },
        { accountNumber: '6543210987654321', balance: 500 }
      ];

      const service = new AccountsService(records);

      expect(service.getAccountCount()).toBe(2);
    });
  });

  describe('hasAccount', () => {
    it('should return true for existing account', () => {
      const records: AccountCsvRow[] = [
        { accountNumber: '1234567890123456', balance: 1000 }
      ];
      const service = new AccountsService(records);

      expect(service.hasAccount('1234567890123456')).toBe(true);
    });

    it('should return false for non-existing account', () => {
      const records: AccountCsvRow[] = [
        { accountNumber: '1234567890123456', balance: 1000 }
      ];
      const service = new AccountsService(records);

      expect(service.hasAccount('9999999999999999')).toBe(false);
    });
  });

  describe('debit', () => {
    it('should debit from existing account with sufficient balance', () => {
      const records: AccountCsvRow[] = [
        { accountNumber: '1234567890123456', balance: 1000 }
      ];
      const service = new AccountsService(records);

      const result = service.debit('1234567890123456', 500);

      expect(result.state).toBe('success');
    });

    it('should fail to debit from non-existing account', () => {
      const records: AccountCsvRow[] = [
        { accountNumber: '1234567890123456', balance: 1000 }
      ];
      const service = new AccountsService(records);

      const result = service.debit('9999999999999999', 500);

      expect(result.state).toBe('failure');
      expect(result.errorMessage).toBe('Account 9999999999999999 not found');
    });

    it('should fail to debit with insufficient balance', () => {
      const records: AccountCsvRow[] = [
        { accountNumber: '1234567890123456', balance: 100 }
      ];
      const service = new AccountsService(records);

      const result = service.debit('1234567890123456', 500);

      expect(result.state).toBe('failure');
      expect(result.errorMessage).toBe('Insufficient funds: balance 100, required 500');
    });
  });

  describe('credit', () => {
    it('should credit to existing account', () => {
      const records: AccountCsvRow[] = [
        { accountNumber: '1234567890123456', balance: 1000 }
      ];
      const service = new AccountsService(records);

      const result = service.credit('1234567890123456', 500);

      expect(result.state).toBe('success');
    });

    it('should fail to credit to non-existing account', () => {
      const records: AccountCsvRow[] = [
        { accountNumber: '1234567890123456', balance: 1000 }
      ];
      const service = new AccountsService(records);

      const result = service.credit('9999999999999999', 500);

      expect(result.state).toBe('failure');
      expect(result.errorMessage).toBe('Account 9999999999999999 not found');
    });
  });

  describe('exportAccounts', () => {
    it('should export accounts as string array', () => {
      const records: AccountCsvRow[] = [
        { accountNumber: '1234567890123456', balance: 1000 },
        { accountNumber: '6543210987654321', balance: 500 }
      ];
      const service = new AccountsService(records);

      const exported = service.exportAccounts();

      expect(exported).toHaveLength(2);
      expect(exported[0]).toEqual(['1234567890123456', '1000']);
      expect(exported[1]).toEqual(['6543210987654321', '500']);
    });

    it('should export empty array when no accounts', () => {
      const service = new AccountsService([]);

      const exported = service.exportAccounts();

      expect(exported).toHaveLength(0);
    });

    it('should reflect balance changes after transactions', () => {
      const records: AccountCsvRow[] = [
        { accountNumber: '1234567890123456', balance: 1000 }
      ];
      const service = new AccountsService(records);

      service.debit('1234567890123456', 200);
      const exported = service.exportAccounts();

      expect(exported[0]).toEqual(['1234567890123456', '800']);
    });
  });
});
