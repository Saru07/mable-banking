import { TransferValidator } from '../../validators/TransferValidator';

describe('TransferValidator', () => {
  let validator: TransferValidator;

  beforeEach(() => {
    validator = new TransferValidator();
  });

  describe('validate', () => {
    it('should succeed with valid transfer data', () => {
      const result = validator.validate(['1234567890123456', '1234567890123457', '500']);
      
      expect(result.state).toBe('success');
    });

    it('should succeed with decimal amount', () => {
      const result = validator.validate(['1234567890123456', '1234567890123457', '123.45']);
      
      expect(result.state).toBe('success');
    });

    it('should fail when record has less than 3 fields', () => {
      const result = validator.validate(['1234567890123456', '1234567890123457']);
      
      expect(result.state).toBe('failure');
      expect(result.errorMessage).toBe('Invalid format - expected 3 columns (fromAccount,toAccount,amount), got 2');
    });

    it('should fail when record has more than 3 fields', () => {
      const result = validator.validate(['1234567890123456', '1234567890123457', '500', 'extra']);
      
      expect(result.state).toBe('failure');
      expect(result.errorMessage).toBe('Invalid format - expected 3 columns (fromAccount,toAccount,amount), got 4');
    });

    it('should fail when from account is empty', () => {
      const result = validator.validate(['', '1234567890123457', '500']);
      
      expect(result.state).toBe('failure');
      expect(result.errorMessage).toBe('From account cannot be empty');
    });

    it('should fail when from account is whitespace only', () => {
      const result = validator.validate(['   ', '1234567890123457', '500']);
      
      expect(result.state).toBe('failure');
      expect(result.errorMessage).toBe('From account cannot be empty');
    });
    
    it('should fail when from account is less than 16 digits', () => {
      const result = validator.validate(['1234567890', '1234567890123457', '500']);
      
      expect(result.state).toBe('failure');
      expect(result.errorMessage).toBe('Invalid from account - must be exactly 16 digits');
    });
    
    it('should fail when from account is more than 16 digits', () => {
      const result = validator.validate(['12345678901234567890', '1234567890123457', '500']);
      
      expect(result.state).toBe('failure');
      expect(result.errorMessage).toBe('Invalid from account - must be exactly 16 digits');
    });

    it('should fail when to account is empty', () => {
      const result = validator.validate(['1234567890123456', '', '500']);
      
      expect(result.state).toBe('failure');
      expect(result.errorMessage).toBe('To account cannot be empty');
    });

    it('should fail when to account is whitespace only', () => {
      const result = validator.validate(['1234567890123456', '   ', '500']);
      
      expect(result.state).toBe('failure');
      expect(result.errorMessage).toBe('To account cannot be empty');
    });
    
    it('should fail when to account is less than 16 digits', () => {
      const result = validator.validate(['1234567890123456', '1234567890', '500']);
      
      expect(result.state).toBe('failure');
      expect(result.errorMessage).toBe('Invalid to account - must be exactly 16 digits');
    });
    
    it('should fail when to account is more than 16 digits', () => {
      const result = validator.validate(['1234567890123456', '12345678901234567890', '500']);
      
      expect(result.state).toBe('failure');
      expect(result.errorMessage).toBe('Invalid to account - must be exactly 16 digits');
    });

    it('should fail when amount is not a number', () => {
      const result = validator.validate(['1234567890123456', '1234567890123457', 'invalid']);
      
      expect(result.state).toBe('failure');
      expect(result.errorMessage).toBe('Invalid amount - must be a number');
    });

    it('should fail when amount is empty', () => {
      const result = validator.validate(['1234567890123456', '1234567890123457', '']);
      
      expect(result.state).toBe('failure');
      expect(result.errorMessage).toBe('Amount cannot be empty');
    });

    it('should fail when amount is zero', () => {
      const result = validator.validate(['1234567890123456', '1234567890123457', '0']);
      
      expect(result.state).toBe('failure');
      expect(result.errorMessage).toBe('Invalid amount - must be greater than zero');
    });

    it('should fail when amount is negative', () => {
      const result = validator.validate(['1234567890123456', '1234567890123457', '-100']);
      
      expect(result.state).toBe('failure');
      expect(result.errorMessage).toBe('Invalid amount - must be greater than zero');
    });
  });
});
