const express = require("express");
const sqlite3 = require("sqlite3");
const router = express.Router();

const db = new sqlite3.Database("database.db");

router.use(express.json());

router
  .route("/")
  .get((req, res) => {
    const query = "SELECT * FROM categories";

    db.all(query, [], (err, rows) => {
      if (err) {
        console.log("Error retrieving categories from database");
        return res
          .status(500)
          .json({ error: "Internal error retrieving categories" });
      }

      return res.status(200).json(rows);
    });
  })
  .post((req, res) => {
    const query = "INSERT INTO categories (categoryName) VALUES (?)";

    const categoryName = req.body.categoryName;

    if (!categoryName) {
      return res
        .status(400)
        .json({ error: "categoryName field not specified" });
    }

    db.run(query, [categoryName], function (err) {
      if (err) {
        console.log("Error inserting data into categories: ", err.message);
        return res
          .status(500)
          .json({ error: "Error adding category to database" });
      }

      console.log(
        `Category added successfully to database with id=${this.lastID}`
      );
      return res.status(201).json({ id: this.lastID });
    });
  });

router.route("/:id").get((req, res) => {
  const id = req.params.id;
  const query = `SELECT * FROM categories WHERE categoryId=${id}`;

  db.get(query, [], (err, row) => {
    if (err) {
      console.log(`Error retrieving category with categoryId=${id}`);
      return res
        .status(500)
        .json({ error: "Infernal error retrieving category" });
    }

    if (row) {
      return res.status(200).json(row);
    } else {
      return res
        .status(404)
        .json({ error: `Category with id=${id} not found` });
    }
  });
});

module.exports = router;
