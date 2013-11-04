"use strict"

var SHAPE   = "n"
var DATA    = "d"
var STRIDE  = "s"
var STEP    = "p"
var OFFSET  = "o"
var INDEX   = "i"

module.exports = computePrefixSum

function generateScan(type, boundaries, n) {
  if(n === 0) {
    var neighbors = [ [] ]
    for(var i=0; i<boundaries.length; ++i) {
      if(boundaries[i]) {
        continue
      }
      var nn = neighbors.length
      for(var j=0; j<nn; ++j) {
        var v = neighbors[j].slice()
        v.push(STRIDE + i)
        neighbors.push(v)
      }
    }
    if(neighbors.length === 1) {
      return ""
    }
    var result = []
    if(type === "generic") {
      result.push(DATA, ".set(", OFFSET, ",", DATA, ".get(", OFFSET, ")+")
    } else {
      result.push(DATA, "[", OFFSET, "]+=")
    }
    for(var i=1; i<neighbors.length; ++i) {
      var v = neighbors[i]
      var negative = (v.length + 1) % 2
      if(i > 1 && !negative) {
        result.push("+")
      } else if(negative) {
        result.push("-")
      }
      if(type === "generic") {
        result.push(DATA, ".get(")
      } else {
        result.push(DATA, "[")
      }
      result.push(OFFSET, "-", v.join("-"))
      if(type === "generic") {
        result.push(")")
      } else {
        result.push("]")
      }
    }
    if(type === "generic") {
      result.push(");")
    } else {
      result.push(";")
    }
    return result.join("")
  }
  boundaries[n-1] = true
  var code = [
    generateScan(type, boundaries, n-1),
    OFFSET, "+=", STEP, n-1,
    ";for(", INDEX, n-1, "=1;", INDEX, n-1, "<", SHAPE, n-1, ";++", INDEX, n-1, "){",
  ]
  boundaries[n-1] = false
  code.push(generateScan(type, boundaries, n-1),
    OFFSET, "+=", STEP, n-1, ";}")
  return code.join("")
}

function generatePrefixSumCode(type, order) {
  //Initialize local variables

  var funcName = [ "prefixSum", order.length, "d", type, "s", order.join("s") ].join("")

  var code = [ 
    "function ", funcName, "(arr){var ",
      DATA, "=arr.data,",
      SHAPE, "=arr.shape,",
      STRIDE, "=arr.stride,",
      OFFSET, "=arr.offset,"
  ]
  var n = order.length
  for(var i=0; i<n; ++i) {
    code.push(SHAPE, i, "=", SHAPE, "[", order[i], "],")
  }
  for(var i=0; i<n; ++i) {
    code.push(STRIDE, i, "=", STRIDE, "[", order[i], "],")
  }
  for(var i=0; i<n; ++i) {
    code.push(INDEX, i, "=0,")
  }
  for(var i=n-1; i>0; --i) {
    code.push(STEP, i, "=", STRIDE, i, "-", SHAPE, i-1, "*", STRIDE, i-1, ",")
  }
  code.push(STEP, "0=", STRIDE, 0, ";")

  //Generate scan code recursively
  var boundaries = new Array(n)
  for(var i=0; i<n; ++i) {
    boundaries[i] = true
  }
  code.push(
    generateScan(type, boundaries, n), "}return ", funcName
  )

  //Allocate subroutine and return
  var proc = new Function(code.join(""))
  return proc()
}

var CACHE = {}

function computePrefixSum(array) {
  var key = array.dtype + array.order.join()
  var proc = CACHE[key]
  if(!proc) {
    proc = CACHE[key] = generatePrefixSumCode(array.dtype, array.order)
  }
  proc(array)
  return array
}