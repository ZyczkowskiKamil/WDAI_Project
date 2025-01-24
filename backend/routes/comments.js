const express = require("express");
const sqlite3 = require("sqlite3");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config(); // for accessing env variables

const db = new sqlite3.Database("database.db");

router.use(express.json());

router
  .route("/")
  .get((req, res) => {
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
  })
  .post((req, res) => {
    const { jwtToken, productId, starsNumber, comment } = req.body;

    if (!jwtToken) {
      return res.status(401).json({ message: "JWT Token is required" });
    }

    try {
      const decoded = jwt.verify(jwtToken, process.env.JWTSECRETKEY);

      // token is ok
      console.log(comment);

      const query =
        "INSERT INTO comments (productId, userId, starsNumber, comment, date) VALUES (?,?,?,?,?)";

      try {
        db.run(
          query,
          [productId, decoded.userId, starsNumber, comment, Date.now()],
          (err) => {
            if (err) {
              console.error("Error inserting comment:", err.message);
              return res.status(500).json({ message: "Failed to add comment" });
            }

            return res
              .status(200)
              .json({ message: "Comment added successfully" });
          }
        );
      } catch (err) {
        console.log("Unexpected error:", err);
        return res.status(500).json({ message: "Unexpected error happened" });
      }
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired jwt token" });
    }
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
