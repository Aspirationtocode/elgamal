import * as BigInteger from "big-integer";

export module PrimeGenerator {
  export function generatePrime(bits: number): BigInteger.BigInteger {
    const bBits = BigInteger(bits);

    const startSearchNumber = BigInteger(2).pow(bBits.prev());

    const lastSearchNumber = startSearchNumber.plus(BigInteger(1000));

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
