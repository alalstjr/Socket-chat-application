const express = require("express");
const router = express.Router();
const db = require("../db");

// @GetMapping
router.get("/", (req, res) => {
    db.any("SELECT * FROM account;")
    .then(rows => {
        console.log(rows);
        res.json(rows);
    })
    .catch(error => {
        console.log(error);
    });
});

module.exports = router;