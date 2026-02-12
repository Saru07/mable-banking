import { AccountValidator } from '../../validators/AccountValidator';

describe('AccountValidator', () => {
  let validator: AccountValidator;

  beforeEach(() => {
    validator = new AccountValidator();
  });

  describe('validate', () => {
    it('should succeed with valid account data', () => {
      const result = validator.validate(['1234567890123456', '1000']);
      
      expect(result.state).toBe('success');
    });

    it('should succeed with zero balance', () => {
      const result = validator.validate(['1234567890123456', '0']);
      
      expect(result.state).toBe('success');
    });
    
    it('should succeed with decimal balance', () => {
        const result = validator.validate(['1234567890123456', '1234.56']);
        
        expect(result.state).toBe('success');
    });
    
    it('should fail when record has less than 2 fields', () => {
        const result = validator.validate(['1234567890123456']);
        
        expect(result.state).toBe('failure');
        expect(result.errorMessage).toBe('Account record must have 2 fields');
    });
    
    it('should fail when record has more than 2 fields', () => {
        const result = validator.validate(['1234567890123456', '1000', 'extra']);
        
        expect(result.state).toBe('failure');
        expect(result.errorMessage).toBe('Account record must have 2 fields');
    });
    
    it('should fail when account number is empty', () => {
        const result = validator.validate(['', '1000']);
        
        expect(result.state).toBe('failure');
        expect(result.errorMessage).toBe('Account number cannot be empty');
    });
    
    it('should fail when account number is whitespace only', () => {
        const result = validator.validate(['   ', '1000']);
        
        expect(result.state).toBe('failure');
        expect(result.errorMessage).toBe('Account number cannot be empty');
    });
    
    it('should fail when account number is less than 16 digits', () => {
        const result = validator.validate(['1234567890', '1000']);
        
        expect(result.state).toBe('failure');
        expect(result.errorMessage).toBe('Invalid account number - must be exactly 16 digits');
    });
    
    it('should fail when account number is more than 16 digits', () => {
        const result = validator.validate(['12345678901234567890', '1000']);
        
        expect(result.state).toBe('failure');
        expect(result.errorMessage).toBe('Invalid account number - must be exactly 16 digits');
    });
    
    it('should fail when balance is a negative number', () => {
      const result = validator.validate(['1234567890123456', '-500']);
      
      expect(result.state).toBe('failure');
      expect(result.errorMessage).toBe('Invalid balance - cannot be negative');
    });

    it('should fail when balance is not a number', () => {
      const result = validator.validate(['1234567890123456', 'invalid']);
      
      expect(result.state).toBe('failure');
      expect(result.errorMessage).toBe('Invalid balance - must be a number');
    });

    it('should fail when balance is empty', () => {
      const result = validator.validate(['1234567890123456', '']);
      
      expect(result.state).toBe('failure');
      expect(result.errorMessage).toBe('Balance cannot be empty');
    });
  });
});
