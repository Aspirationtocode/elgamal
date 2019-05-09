"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BigInteger = require("big-integer");
var PrimeGenerator;
(function (PrimeGenerator) {
    function generatePrime(bits) {
        const bBits = BigInteger(bits);
        const startSearchNumber = BigInteger(2).pow(bBits.prev());
        const lastSearchNumber = startSearchNumber.plus(BigInteger(1000));
        let currentNumber = BigInteger.randBetween(startSearchNumber, lastSearchNumber);
        while (!currentNumber.isPrime()) {
            currentNumber = currentNumber.next();
        }
        return currentNumber;
    }
    PrimeGenerator.generatePrime = generatePrime;
})(PrimeGenerator = exports.PrimeGenerator || (exports.PrimeGenerator = {}));
