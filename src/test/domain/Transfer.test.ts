import { Transfer } from '../../domain/Transfer';

describe('Transfer', () => {
  describe('constructor', () => {
    it('should create a transfer with valid data', () => {
      const transfer = new Transfer('ACC001', 'ACC002', 500);
      
      expect(transfer.fromAccountNumber).toBe('ACC001');
      expect(transfer.toAccountNumber).toBe('ACC002');
      expect(transfer.amount).toBe(500);
    });
  });

  describe('validate', () => {
    it('should succeed for valid transfer', () => {
      const transfer = new Transfer('ACC001', 'ACC002', 500);
      
      const result = transfer.validate();
      
      expect(result.state).toBe('success');
    });

    it('should fail when transferring to same account', () => {
      const transfer = new Transfer('ACC001', 'ACC001', 500);
      
      const result = transfer.validate();
      
      expect(result.state).toBe('failure');
      expect(result.errorMessage).toBe('Cannot transfer to the same account');
    });

    it('should fail when amount is zero', () => {
      const transfer = new Transfer('ACC001', 'ACC002', 0);
      
      const result = transfer.validate();
      
      expect(result.state).toBe('failure');
      expect(result.errorMessage).toBe('Transfer amount must be greater than zero');
    });

    it('should fail when amount is negative', () => {
      const transfer = new Transfer('ACC001', 'ACC002', -100);
      
      const result = transfer.validate();
      
      expect(result.state).toBe('failure');
      expect(result.errorMessage).toBe('Transfer amount must be greater than zero');
    });

    it('should succeed with decimal amounts', () => {
      const transfer = new Transfer('ACC001', 'ACC002', 123.45);
      
      const result = transfer.validate();
      
      expect(result.state).toBe('success');
    });

    it('should succeed with very small positive amounts', () => {
      const transfer = new Transfer('ACC001', 'ACC002', 0.01);
      
      const result = transfer.validate();
      
      expect(result.state).toBe('success');
    });
  });
});
