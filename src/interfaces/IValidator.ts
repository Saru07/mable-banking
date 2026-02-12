export interface IValidator {
  validate(record: string[], lineNumber: number): void;
}
