import * as BigInteger from "big-integer";

export module PrimeGenerator {
  export function generatePrime(bits: number): BigInteger.BigInteger {
    const bBits = BigInteger(bits);

    let currentNumber = BigInteger(2).pow(bBits.prev());

    while (!currentNumber.isPrime()) {
      currentNumber = currentNumber.next();
    }
    return currentNumber;
  }
}
