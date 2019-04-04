import * as BigInteger from "big-integer";

export module PrimeGenerator {
  export function generatePrime(bits: number): BigInteger.BigInteger {
    const bBits = BigInteger(bits);

    const startSearchNumber = BigInteger(2).pow(bBits.prev());

    const lastSearchNumber = BigInteger(2).pow(
      bBits.multiply(BigInteger(2)).prev()
    );

    let currentNumber = BigInteger.randBetween(
      startSearchNumber,
      lastSearchNumber
    );

    while (!currentNumber.isPrime()) {
      currentNumber = currentNumber.next();
    }
    return currentNumber;
  }
}
