const express = require("express");
const sqlite3 = require("sqlite3");
const router = express.Router();

const db = new sqlite3.Database("database.db");

router.use(express.json());

router
  .route("/")
  .get((req, res) => {
    const query = "SELECT * FROM brands";

    db.all(query, [], (err, rows) => {
      if (err) {
        console.log("Error retrieving brands from database");
        return res
          .status(500)
          .json({ error: "Internal error retrieving brands" });
      }

      return res.status(200).json(rows);
    });
  })
  .post((req, res) => {
    const query = "INSERT INTO brands (brandName) VALUES (?)";

    const brandName = req.body.brandName;

    if (!brandName) {
      return res.status(400).json({ error: "brandName field not specified" });
    }

    db.run(query, [brandName], function (err) {
      if (err) {
        console.log("Error inserting data into brands: ", err.message);
        return res
          .status(500)
          .json({ error: "Error adding brand to database" });
      }

      console.log(
        `Brand added successfully to database with id=${this.lastID}`
      );
      return res.status(201).json({ id: this.lastID });
    });
  });

router.route("/:id").get((req, res) => {
  const id = req.params.id;
  const query = `SELECT * FROM brands WHERE brandId=${id}`;

  db.get(query, [], (err, row) => {
    if (err) {
      console.log(`Error retrieving brand with brandId=${id}`);
      return res.status(500).json({ error: "Infernal error retrieving brand" });
    }

    if (row) {
      return res.status(200).json(row);
    } else {
      return res.status(404).json({ error: `Brand with id=${id} not found` });
    }
  });
});

module.exports = router;
