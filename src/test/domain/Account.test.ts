import { Account } from '../../domain/Account';

describe('Account', () => {
  describe('constructor', () => {
    it('should create an account with valid data', () => {
      const account = new Account('ACC001', 1000);
      
      expect(account.accountNumber).toBe('ACC001');
      expect(account.balance).toBe(1000);
    });

    it('should create an account with zero balance', () => {
      const account = new Account('ACC002', 0);
      
      expect(account.balance).toBe(0);
    });
  });

  describe('debit', () => {
    it('should debit amount when sufficient balance', () => {
      const account = new Account('ACC001', 1000);
      
      const result = account.debit(500);
      
      expect(result.state).toBe('success');
      expect(account.balance).toBe(500);
    });

    it('should fail to debit when insufficient balance', () => {
      const account = new Account('ACC001', 100);
      
      const result = account.debit(500);
      
      expect(result.state).toBe('failure');
      expect(result.errorMessage).toBe(`Insufficient funds: balance ${account.balance}, required 500`);
      expect(account.balance).toBe(100); // Balance unchanged
    });

    it('should fail to debit negative amount', () => {
      const account = new Account('ACC001', 1000);
      
      const result = account.debit(-100);
      
      expect(result.state).toBe('failure');
      expect(result.errorMessage).toBe('Debit amount must be positive');
      expect(account.balance).toBe(1000); // Balance unchanged
    });

    it('should fail to debit zero amount', () => {
      const account = new Account('ACC001', 1000);
      
      const result = account.debit(0);
      
      expect(result.state).toBe('failure');
      expect(result.errorMessage).toBe('Debit amount must be positive');
      expect(account.balance).toBe(1000);
    });

    it('should allow debit of exact balance', () => {
      const account = new Account('ACC001', 1000);
      
      const result = account.debit(1000);
      
      expect(result.state).toBe('success');
      expect(account.balance).toBe(0);
    });
  });

  describe('credit', () => {
    it('should credit amount to account', () => {
      const account = new Account('ACC001', 1000);
      
      const result = account.credit(500);
      
      expect(result.state).toBe('success');
      expect(account.balance).toBe(1500);
    });

    it('should fail to credit negative amount', () => {
      const account = new Account('ACC001', 1000);
      
      const result = account.credit(-100);
      
      expect(result.state).toBe('failure');
      expect(result.errorMessage).toBe('Credit amount must be positive');
      expect(account.balance).toBe(1000); // Balance unchanged
    });

    it('should fail to credit zero amount', () => {
      const account = new Account('ACC001', 1000);
      
      const result = account.credit(0);
      
      expect(result.state).toBe('failure');
      expect(result.errorMessage).toBe('Credit amount must be positive');
      expect(account.balance).toBe(1000);
    });

    it('should credit to zero balance account', () => {
      const account = new Account('ACC001', 0);
      
      const result = account.credit(1000);
      
      expect(result.state).toBe('success');
      expect(account.balance).toBe(1000);
    });
  });
});
