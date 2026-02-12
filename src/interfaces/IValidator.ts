import { Result } from "../types/Results";

export interface IValidator {
  validate(record: string[]): Result;
}
