const express = require("express");
const sqlite3 = require("sqlite3");
const router = express.Router();

const db = new sqlite3.Database("database.db");

router.use(express.json());

router
  .route("/")
  .get((req, res) => {
    const query = "SELECT * FROM products";

    db.all(query, [], (err, rows) => {
      if (err) {
        console.log("Error while retrieving products from database");
        return res.status(500).json({
          error: "Internal error while retrieving products",
        });
      }

      return res.status(200).json(rows);
    });
  })
  .post((req, res) => {
    const query =
      "INSERT INTO products (title,description,categoryId,brandId,imageUrl,price,discount,stockQuantity) VALUES (?,?,?,?,?,?,?,?)";

    const {
      title,
      description,
      categoryId,
      brandId,
      imageUrl,
      price,
      discount,
      stockQuantity,
    } = req.body;

    if (
      !title ||
      !description ||
      !categoryId ||
      !brandId ||
      !price ||
      (!discount && discount != 0) ||
      (!stockQuantity && stockQuantity != 0)
    ) {
      return res
        .status(400)
        .json({ error: "All fields without imageUrl need to be specified" });
    }

    db.run(
      query,
      [
        title,
        description,
        categoryId,
        brandId,
        imageUrl,
        price,
        discount,
        stockQuantity,
      ],
      function (err) {
        if (err) {
          console.log("Error inserting data into products: ", err.message);
          return res
            .status(500)
            .json({ error: "Error adding product to database" });
        }

        console.log(
          `Product added successfully to database with id=${this.lastID}`
        );
        return res.status(201).json({ id: this.lastID });
      }
    );
  });

router.route("/:id").get((req, res) => {
  const productId = req.params.id;
  const query = `SELECT * FROM products WHERE id=${productId}`;

  db.get(query, [], (err, row) => {
    if (err) {
      console.log(
        `Error while retrieving product with id=${productId}`,
        err.message
      );
      return res.status(500).json({
        error: `Error retrieving product with id=${productId} from database`,
      });
    }

    if (row) return res.status(200).json(row);
    else
      return res.status(404).json({
        error: `Product with id=${productId} not found`,
      });
  });
});

module.exports = router;
