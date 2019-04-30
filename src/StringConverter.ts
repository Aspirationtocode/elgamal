import * as BigInteger from "big-integer";

const convert = require("binstring");

export module StringConverter {
  export function fromStringToHex(str: string) {
    return convert(encodeURIComponent(str), { in: "binary", out: "hex" });
  }

  export function fromHexToString(hex: string) {
    return decodeURIComponent(convert(hex, { in: "hex", out: "binary" }));
  }
}
