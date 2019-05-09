"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const convert = require("binstring");
const utf8 = require("utf8");
var StringConverter;
(function (StringConverter) {
    function fromStringToHex(str) {
        return convert(utf8.encode(str), { in: "binary", out: "hex" });
    }
    StringConverter.fromStringToHex = fromStringToHex;
    function fromHexToString(hex) {
        return utf8.decode(convert(hex, { in: "hex", out: "binary" }));
    }
    StringConverter.fromHexToString = fromHexToString;
})(StringConverter = exports.StringConverter || (exports.StringConverter = {}));
