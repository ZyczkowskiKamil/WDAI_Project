const express = require("express");
const sqlite3 = require("sqlite3");
const router = express.Router();

const db = new sqlite3.Database("database.db");

router.use(express.json());

router.route("/").get((req, res) => {
  const query = "SELECT * FROM comments";

  db.all(query, [], (err, rows) => {
    if (err) {
      console.log("Error retrieving comments from database");
      return res
        .status(500)
        .json({ error: "Internal error retrieving comments" });
    }

    return res.status(200).json(rows);
  });
});

router.route("/getcommentsforproduct/:id").get((req, res) => {
  const id = req.params.id;
  const query = `SELECT * FROM comments WHERE productId=${id}`;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.log(`Error retrieving comments for productId=${id}`);
      return res.status(500).json();
    }

    return res.status(200).json(rows);
  });
});

module.exports = router;
