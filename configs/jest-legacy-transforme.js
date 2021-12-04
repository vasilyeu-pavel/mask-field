const fs = require("fs")
const path = require("path")
const babelJest = require("babel-jest")

const babelrc = fs.readFileSync(path.resolve(".babelrc"), { encoding: "utf8" })
module.exports = babelJest.createTransformer(JSON.parse(babelrc))
