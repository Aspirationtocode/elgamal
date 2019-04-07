import * as BigInteger from "big-integer";

export module StringConverter {
  export function fromStringToHex(str: string) {
    const hex = str
      .split("")
      .map(symbol => {
        const hexCode = fromDecToHex(symbol.charCodeAt(0).toString());
        return hexCode;
      })
      .join("");
    return hex;
  }

  export function fromHexToString(hex: string) {
    let finalString = "";
    for (let i = 0; i < hex.length; i += 2) {
      const hexCode = hex[i] + hex[i + 1];
      console.log(hexCode);
      const symbolCode = fromHexToDec(hexCode);

      const symbol = String.fromCharCode(+symbolCode);

      finalString += symbol;
    }
    return finalString;
  }

  function fromHexToDec(hexNumber: string) {
    return BigInteger(hexNumber, 16).toString(10);
  }

  function fromDecToHex(decNumber: string) {
    return BigInteger(decNumber, 10).toString(16);
  }
}
