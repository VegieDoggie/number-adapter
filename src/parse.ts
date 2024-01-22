export type FloatLike = number | string | bigint


/*
* The underlying representation of a number only supports a maximum of
* 15 significant digits (IEEE 754, see: Number.EPSILON).
* */

const parseBigint = (num: FloatLike, enlarge = 0): bigint => {
    switch (typeof num) {
        case "bigint": {
            return enlarge >= 0 ? num * 10n ** BigInt(enlarge) : num / 10n ** BigInt(-enlarge);
        }
        case "string": {
            // hex number
            if (isHex(num)) {
                return parseBigint(BigInt(num), enlarge)
            } else {
                // exp number
                const es = isExponential(num)
                if (es) {
                    return parseBigint(parseBigint(es[0], Number(es[1])), enlarge)
                }
            }
            // dot number
            const dots = num.split(".")
            if (dots.length === 1) {
                return parseBigint(BigInt(num), enlarge)
            }
            const exp = 10n ** BigInt(Math.abs(enlarge))
            return enlarge > 0
                ? BigInt(dots[0]) * exp + BigInt(dots[1]) * exp / 10n ** BigInt(dots[1].length)
                : BigInt(dots[0]) / exp
        }
        case "number":
            const es = isExponential(num)
            if (es) {
                return parseBigint(parseBigint(es[0], Number(es[1])), enlarge)
            }
            return parseBigint(num.toPrecision(15), enlarge)
    }
}

const parseNoneExpNumStr = (num: string, enlarge: number) => {
    if (enlarge === 0) {
        return trimDot0(num)
    } else {
        // sign = ±
        let sign = ""
        if (num.startsWith("-")) {
            sign = "-"
            num = num.slice(1)
        }
        // dot split
        const dots = num.split(".")
        if (dots.length === 1) {
            dots.push("")
        }
        // enlarge shift
        let numStr: string;
        if (enlarge > 0) {
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
        return sign + trimDot0(numStr)
    }
}

const parseNumStr = (num: FloatLike, enlarge = 0): string => {
    switch (typeof num) {
        case "bigint": {
            return enlarge >= 0
                ? (num * 10n ** BigInt(enlarge)).toString()
                : parseNoneExpNumStr(num.toString(10), enlarge);
        }
        case "string": {
            // hex number
            if (isHex(num)) {
                num = BigInt(num).toString(10)
            } else {
                // exp number
                const es = isExponential(num)
                if (es) {
                    num = parseNoneExpNumStr(es[0], Number(es[1]))
                }
            }
            return parseNoneExpNumStr(num, enlarge)
        }
        case "number":
            const es = isExponential(num)
            if (es) {
                return parseNumStr(parseNumStr(es[0], Number(es[1])), enlarge)
            }
            return parseNumStr(num.toPrecision(15), enlarge)
    }
}

const trimDot0 = (str: string) => {
    if (Number(str) % 1 === 0) return str.split(".")[0]

    let i = str.length - 1;
    while (i >= 0 && str[i] === "0") {
        i--;
    }
    if (i < 0) {
        return "0";
    }
    str = str.slice(0, i + 1)
    return str.endsWith(".") ? str.slice(0, -1) : str;
}

const isExponential = (num: Exclude<FloatLike, bigint>) => {
    const es = String(num).split(/[eE]/)
    return es.length === 2 && !Number.isNaN(Number(es[1])) && es
}

const isHex = (str: string) => {
    return str.length >= 2 && (str[0] === '0' && (str[1] === 'x' || str[1] === 'X'));
}

export {parseBigint, parseNumStr}
