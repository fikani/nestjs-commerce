export interface Equals<T = any> {
  equals(other: T | null): boolean;
}
