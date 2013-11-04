"use strict"

var ndarray = require("ndarray")
var prefixSum = require("../prefix-sum")

require("tape")("prefix-sum", function(t) {
  var x = ndarray([1,2,3,4,5])

  prefixSum(x)
  t.equals(x.get(0), 1)
  t.equals(x.get(1), 3)
  t.equals(x.get(2), 6)
  t.equals(x.get(3), 10)
  t.equals(x.get(4), 15)

  x = ndarray([1,2,3,4,5]).step(-1)
  prefixSum(x)
  t.equals(x.get(0), 5)
  t.equals(x.get(1), 9)
  t.equals(x.get(2), 12)
  t.equals(x.get(3), 14)
  t.equals(x.get(4), 15)

  var x = ndarray([
    0, 1, 2, 3,
    4, 5, 6, 7,
    8, 9, 10, 11,
    12, 13, 14, 15
  ], [4,4])
  prefixSum(x)
  t.equals(x.get(0,0), 0)
  t.equals(x.get(0,1), 1)
  t.equals(x.get(0,2), 3)
  t.equals(x.get(0,3), 6)
  t.equals(x.get(1,0), 4)
  t.equals(x.get(1,1), 10)
  t.equals(x.get(1,2), 18)
  t.equals(x.get(1,3), 28)

  prefixSum(x.transpose(1,0))

  t.end()
})