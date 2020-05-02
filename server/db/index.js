// PostgreSQL
const pgp = require("pg-promise")();
const connectionString = "postgresql://postgres:root@localhost:5432/expressdb";
const db = pgp(connectionString);

module.exports = db;