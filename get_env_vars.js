const path = require('path')
const reVar = require('dotenv').config({ path: path.join(__dirname, '/.env') })
const envVars = reVar.parsed
module.exports = envVars