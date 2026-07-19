export type FloatLike = number | string | bigint


/*
* The underlying representation of a number only supports a maximum of
* 15 significant digits (IEEE 754, see: Number.EPSILON).
* */

const parseBigint = (num: FloatLike, enlarge = 0): bigint => {
    if (typeof num === "bigint") {
        return enlarge >= 0 ? num * 10n ** BigInt(enlarge) : num / 10n ** BigInt(-enlarge);
    }
    // truncate toward zero when a fractional part remains after shifting
    return BigInt(parseNumStr(num, enlarge).split(".")[0])
}

const DECIMAL_RE = /^[+-]?(\d+(\.\d*)?|\.\d+)$/

const parseNoneExpNumStr = (num: string, enlarge: number): string => {
    if (!DECIMAL_RE.test(num)) {
        throw new SyntaxError(`Cannot convert "${num}" to a numeric string`)
    }
    // sign = ±
    let sign = ""
    if (num.startsWith("-")) {
        sign = "-"
        num = num.slice(1)
    } else if (num.startsWith("+")) {
        num = num.slice(1)
    }
    // dot split
    const dots = num.split(".")
    if (dots.length === 1) {
        dots.push("")
    }
    // enlarge shift
    let numStr: string;
    if (enlarge === 0) {
        numStr = num
    } else if (enlarge > 0) {
        // shift right: =>
        if (enlarge >= dots[1].length) { // append: 0
            numStr = dots[0] + dots[1] + "0".repeat(enlarge - dots[1].length)
        } else {
            numStr = dots[0] + dots[1].slice(0, enlarge) + "." + dots[1].slice(enlarge)
        }
    } else {
        // shift left: <=
        enlarge = -enlarge;
        if (enlarge >= dots[0].length) { // append: 0
            numStr = "0." + "0".repeat(enlarge - dots[0].length) + dots[0] + dots[1]
        } else {
            const dot = dots[0].length - enlarge
            numStr = dots[0].slice(0, dot) + "." + dots[0].slice(dot) + dots[1]
        }
    }
    return trimNumStr(sign + numStr)
}

const parseNumStr = (num: FloatLike, enlarge = 0): string => {
    if (!Number.isInteger(enlarge)) {
        throw new TypeError(`enlarge must be an integer, got: ${enlarge}`)
    }
    switch (typeof num) {
        case "bigint": {
            return enlarge >= 0
                ? (num * 10n ** BigInt(enlarge)).toString()
                : parseNoneExpNumStr(num.toString(10), enlarge);
        }
        case "string": {
            num = num.trim()
            // hex number
            if (isHex(num)) {
                num = parseHexBigint(num).toString(10)
            } else {
                // exp number
                const es = isExponential(num)
                if (es) {
                    num = parseNoneExpNumStr(es[0], Number(es[1]))
                }
            }
            return parseNoneExpNumStr(num, enlarge)
        }
        case "number": {
            if (!Number.isFinite(num)) {
                throw new TypeError(`Cannot convert ${num} to a numeric string`)
            }
            const es = isExponential(num)
            if (es) {
                return parseNumStr(parseNumStr(es[0], Number(es[1])), enlarge)
            }
            return parseNumStr(num.toPrecision(15), enlarge)
        }
        default:
            throw new TypeError(`Unsupported input type: ${typeof num}`)
    }
}

// strip leading zeros of the integer part and trailing zeros of the
// fraction part, purely on strings (Number() would lose precision
// beyond 15 significant digits)
const trimNumStr = (str: string) => {
    let sign = ""
    if (str.startsWith("-")) {
        sign = "-"
        str = str.slice(1)
    }
    const dots = str.split(".")
    let int = dots[0].replace(/^0+(?=\d)/, "")
    const frac = (dots[1] ?? "").replace(/0+$/, "")
    if (int === "") {
        int = "0"
    }
    const out = frac ? int + "." + frac : int
    return out === "0" ? "0" : sign + out
}

const isExponential = (num: Exclude<FloatLike, bigint>) => {
    const es = String(num).split(/[eE]/)
    return es.length === 2 && Number.isInteger(Number(es[1])) && es
}

const isHex = (str: string) => {
    const s = (str[0] === "-" || str[0] === "+") ? str.slice(1) : str
    return s.length >= 2 && (s[0] === '0' && (s[1] === 'x' || s[1] === 'X'));
}

// BigInt() rejects signed hex strings like "-0x1f", so split the sign off
const parseHexBigint = (str: string): bigint => {
    if (str[0] === "-") {
        return -BigInt(str.slice(1))
    }
    return BigInt(str[0] === "+" ? str.slice(1) : str)
}

// maybe unsafe: Number cannot represent every result exactly
const parseNumber = (num: FloatLike, enlarge = 0) => {
    return Number(parseNumStr(num, enlarge))
}

export {parseBigint, parseNumStr, parseNumber}
