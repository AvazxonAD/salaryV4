const Pool = require('pg').Pool

const pool = new Pool({
    user: "postgres",
    password: "avazbek+1201",
    host: "localhost",
    port: 5432
})

module.exports = pool 