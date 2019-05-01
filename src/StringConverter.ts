import * as convert from "binstring";
import * as utf8 from "utf8";

export module StringConverter {
  export function fromStringToHex(str: string) {
    return convert(utf8.encode(str), { in: "binary", out: "hex" });
  }

  export function fromHexToString(hex: string) {
    return utf8.decode(convert(hex, { in: "hex", out: "binary" }));
  }
}
