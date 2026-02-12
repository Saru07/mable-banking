import { Result } from '../types/Results';
import { Transfer } from './Transfer';

export interface TransferResult {
  transfer: Transfer;
  result: Result;
}
