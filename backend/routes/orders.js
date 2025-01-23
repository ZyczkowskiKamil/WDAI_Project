const express = require("express");
const sqlite3 = require("sqlite3");
const router = express.Router();

const db = new sqlite3.Database("database.db");

router.use(express.json());

router
  .route("/")
  .get((req, res) => {
    const query = "SELECT * FROM orders";

    db.all(query, [], (err, rows) => {
      if (err) {
        console.log("Error retrieving orders from database");
        return res
          .status(500)
          .json({ error: "Infernal error retrieving orders" });
      }

      return res.status(200).json(rows);
    });
  })
  .post((req, res) => {
    const query =
      "INSERT INTO orders (userId, orderDate, paid, completed) VALUES (?,null,0,0)";

    const userId = req.body.userId;

    if (!userId) {
      return res.status(400).json({ error: "userId field not specified" });
    }

    db.run(query, [userId], function (err) {
      if (err) {
        console.log("Error inserting data into orders: ", err.message);
        return res
          .status(500)
          .json({ error: "Error adding order to database" });
      }

      console.log(
        `Order added successfully to database with id=${this.lastID}`
      );
      return res.status(201).json({ id: this.lastID });
    });
  });

module.exports = router;
