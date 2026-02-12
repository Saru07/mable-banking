export interface ICsvRowMapper<T> {
  map(values: string[]): T;
}