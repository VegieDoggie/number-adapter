# number-adapter

[![NPM Package](https://img.shields.io/npm/v/number-adapter.svg?style=flat-square)](https://www.npmjs.org/package/number-adapter)
[![Minified Size](https://img.shields.io/bundlephobia/min/number-adapter.svg?style=flat-square)](https://bundlephobia.com/result?p=number-adapter)
[![Build Status](https://img.shields.io/travis/com/shrpne/number-adapter/master.svg?style=flat-square)](https://travis-ci.com/shrpne/number-adapter)
[![Coverage Status](https://img.shields.io/coveralls/github/shrpne/number-adapter/master.svg?style=flat-square)](https://coveralls.io/github/shrpne/number-adapter?branch=master)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://github.com/shrpne/number-adapter/blob/master/LICENSE)

Lightweight module to convert number to a human readable string or bigint.

## Install

```
npm install number-adapter
```


## Usage

```js
// usage1.1: parseBigint(<number | string | bigint>) 
parseBigint(100.1) // 100n
// usage1.2: parseBigint(<number | string | bigint>, positive enlarge) 
parseBigint("1.0e0", 18) // 1000000000000000000n
// usage1.3: parseBigint(<number | string | bigint>, nagative enlarge) 
parseBigint(1000000000000000000n, -18)  // 1n

// usage2.1: parseNumStr(<number | string | bigint>) 
parseNumStr(100.1e1) // "1001"
// usage2.2: parseNumStr(<number | string | bigint>, positive enlarge) 
parseNumStr("1.0", 18) // "1000000000000000000"
// usage2.3: parseNumStr(<number | string | bigint>, nagative enlarge) 
parseNumStr(1000000000000000000n, -18)  // "1"
```

## Test
```js

// ============================test===============
import {describe, it} from 'node:test';
import * as assert from "assert";
import {parseBigint, parseNumStr} from "./index.ts";

describe("Number-Adapter", () => {
    it("magic number", () => {
        assert.strictEqual(parseBigint(0.3 / 0.1, 2), 300n)
        assert.strictEqual(parseBigint(0.69 / 10, 3), 69n)
        assert.strictEqual(parseBigint(35.41 * 100, 0), 3541n)
        assert.strictEqual(parseBigint(0.8 * 3, 1), 24n)
        assert.strictEqual(parseBigint(19.9 * 100, 0), 1990n)
        assert.strictEqual(parseBigint(0.3 - 0.2, 1), 1n)
        assert.strictEqual(parseBigint(1.5 - 1.2, 1), 3n)
        assert.strictEqual(parseBigint(0.2 + 0.4, 1), 6n)
        assert.strictEqual(parseBigint(0.7 + 0.1, 1), 8n)
        assert.strictEqual(parseBigint(0.1 + 0.2, 1), 3n)

        // explain: 
        // console.log(`0.3 / 0.1 = ${0.3 / 0.1}`) // 0.3 / 0.1 = 2.9999999999999996
        // console.log(`0.69 / 10 = ${0.69 / 10}`) // 0.69 / 10 = 0.06899999999999999
        // console.log(`35.41 * 100 = ${35.41 * 100}`) // 35.41 * 100 = 3540.9999999999995
        // console.log(`0.8 * 3 = ${0.8 * 3}`) // 0.8 * 3 = 2.4000000000000004
        // console.log(`19.9 * 100 = ${19.9 * 100}`) // 19.9 * 100 = 1989.9999999999998
        // console.log(`0.3 - 0.2 = ${0.3 - 0.2}`) // 0.3 - 0.2 = 0.09999999999999998
        // console.log(`1.5 - 1.2 = ${1.5 - 1.2}`) // 1.5 - 1.2 = 0.30000000000000004
        // console.log(`0.2 + 0.4 = ${0.2 + 0.4}`) // 0.2 + 0.4 = 0.6000000000000001
        // console.log(`0.7 + 0.1 = ${0.7 + 0.1}`) // 0.7 + 0.1 = 0.7999999999999999
        // console.log(`0.1 + 0.2 = ${0.1 + 0.2}`) // 0.1 + 0.2 = 0.30000000000000004
    })
    it("normal number", () => {
        assert.strictEqual(parseBigint(1, 18), 10n ** 18n)
        assert.strictEqual(parseBigint(10n ** 18n, -18), 1n)

        assert.strictEqual(parseBigint("1", 18), 10n ** 18n)
        assert.strictEqual(parseBigint("1.0", 18), 10n ** 18n)
        assert.strictEqual(parseBigint("1.00", 18), 10n ** 18n)
        assert.strictEqual(parseBigint((10n ** 18n).toString(), -18), 1n)


        assert.strictEqual(parseBigint(1, 18), 10n ** 18n)
        assert.strictEqual(parseBigint(1.0, 18), 10n ** 18n)
        assert.strictEqual(parseBigint(1e18, -18), 1n)
    })
    it("string", () => {
        assert.strictEqual(parseNumStr(1, 18), "1000000000000000000")
        assert.strictEqual(parseNumStr(10n ** 18n, -18), "1")

        assert.strictEqual(parseNumStr("1", 18), "1000000000000000000")
        assert.strictEqual(parseNumStr("1.0", 18), "1000000000000000000")
        assert.strictEqual(parseNumStr("1.00", 18), "1000000000000000000")
        assert.strictEqual(parseNumStr((10n ** 18n).toString(), -18), "1")


        assert.strictEqual(parseNumStr(1, 18), "1000000000000000000")
        assert.strictEqual(parseNumStr(1.0, 18), "1000000000000000000")
        assert.strictEqual(parseNumStr(1e18, -18), "1")


        assert.strictEqual(parseNumStr(1.556, 2), "155.6")
        assert.strictEqual(parseNumStr(1.556, -1), "0.1556")
        assert.strictEqual(parseNumStr(1.556, -2), "0.01556")

        assert.strictEqual(parseNumStr("1.556", 2), "155.6")
        assert.strictEqual(parseNumStr("1.556", -1), "0.1556")
        assert.strictEqual(parseNumStr("1.556", -2), "0.01556")

        assert.strictEqual(parseNumStr("1.000", 0), "1")
    })
    it("string", () => {
        const dataset = [
            {input: 0.123e-10, except: "0.0000000000123"},
            {input: 1.123e-10, except: "0.0000000001123"},
            {input: 12.123e-10, except: "0.0000000012123"},
            {input: 123.123e-10, except: "0.0000000123123"},
            {input: 123.123e+20, except: "12312300000000000000000"},
            {input: -0.123e-10, except: "-0.0000000000123"},
            {input: -1.123e-10, except: "-0.0000000001123"},
            {input: -12.123e-10, except: "-0.0000000012123"},
            {input: -123.123e-10, except: "-0.0000000123123"},
            {input: -123.123e+20, except: "-12312300000000000000000"},
            {input: '0.123e-1', except: "0.0123"},
            {input: '1.123e-1', except: "0.1123"},
            {input: '1.123e-5', except: "0.00001123"},
            {input: '12.123e-1', except: "1.2123"},
            {input: '12.123e-5', except: "0.00012123"},
            {input: '123.123e-1', except: "12.3123"},
            {input: '123.123e-5', except: "0.00123123"},
            {input: '123.123e+4', except: "1231230"},
            {input: '123.123e+2', except: "12312.3"},
            {input: '123.123e+0', except: "123.123"},
            {input: '-0.123e-1', except: "-0.0123"},
            {input: '-1.123e-1', except: "-0.1123"},
            {input: '-1.123e-5', except: "-0.00001123"},
            {input: '-12.123e-1', except: "-1.2123"},
            {input: '-12.123e-5', except: "-0.00012123"},
            {input: '-123.123e-1', except: "-12.3123"},
            {input: '-123.123e-5', except: "-0.00123123"},
            {input: '-123.123e+4', except: "-1231230"},
            {input: '-123.123e+2', except: "-12312.3"},
            {input: '-123.123e+0', except: "-123.123"},
            {input: 0, except: "0"},
            {input: 0.0012, except: "0.0012"},
            {input: 123, except: "123"},
            {input: 123e+14, except: "12300000000000000"},
            {input: 0.123e-4, except: "0.0000123"},
            {
                input: Number.MAX_VALUE,
                except: "179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
            },
            {
                input: Number.MIN_VALUE,
                except: "0.000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005"
            },
        ]

        for (let i = 0; i < dataset.length; i++) {
            if (parseNumStr(dataset[i].input) !== dataset[i].except) {
                throw new Error(`${i}, ${dataset[i].input}, ${parseNumStr(dataset[i].input)}, ${dataset[i].except}`)
            }
        }
    })
})
```

## License

MIT License
