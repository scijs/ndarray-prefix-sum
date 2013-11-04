ndarray-prefix-sum
==================
Computes a [prefix sum](http://en.wikipedia.org/wiki/Prefix_sum) of an array, or in higher dimensions the [summed area table](http://en.wikipedia.org/wiki/Summed_area_table) of an image.  Works both in node.js and in the browser.  Built on top of [ndarray](https://github.com/mikolalysenko/ndarray).

## Example

```javascript
var ndarray = require("ndarray")
var prefixSum = require("ndarray-prefix-sum")

var x = ndarray(new Float32Array([1, 2, 3, 4, 5, 6]))

prefixSum(x)

for(var i=0; i<x.shape[0]; ++i) {
  console.log(x.get(i))
}
```

## Install

    npm install ndarray-prefix-sum

## API

### `require("ndarray-prefix-sum")(array)`
Computes the prefix sum of `array` in place.

* `array` is an ndarray

**Returns** `array`

##Credits
(c) 2013 Mikola Lysenko. MIT License