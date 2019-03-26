import * as NumberTheory from "number-theory";

export module PrimeGenerator {
  export function generatePrime(bits: number) {
    const bottomNumber = 2 ** (bits - 1);
    const topNumber = 2 ** bits - 1;
    for (let i = bottomNumber; i <= topNumber; i += 1) {
      if (NumberTheory.isPrime(i)) {
        return i;
      }
    }
  }
}
