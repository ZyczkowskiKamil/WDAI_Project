const express = require("express");
const sqlite3 = require("sqlite3");
const router = express.Router();

const db = new sqlite3.Database("database.db");

router.use(express.json());

router
  .route("/")
  .get((req, res) => {
    const query = "SELECT * FROM orderDetails";

    db.all(query, [], (err, rows) => {
      if (err) {
        console.log("Error retrieving orderDetails from database");
        return res
          .status(500)
          .json({ error: "Infernal error retrieving order details" });
      }

      return res.status(200).json(rows);
    });
  })
  .post((req, res) => {
    const query =
      "INSERT INTO orderDetails (orderId, productId, quantity) VALUES (?,?,?)";

    const { orderId, productId, quantity } = req.body;

    if (!orderId || !productId || !quantity) {
      return res.status(400).json({ error: "All fields need to be specified" });
    }

    db.run(query, [orderId, productId, quantity], (err) => {
      if (err) {
        console.log(
          "Error inserting order details into products: ",
          err.message
        );
        return res.status(500).json({
          error:
            "Product already in order or Infernal error adding product to order in database",
        });
      }

      console.log("Order detail added successfully to database");
      return res
        .status(201)
        .json({ status: "Product added successfully to order" });
    });
  });

router.route("/:orderId").get((req, res) => {
  const orderId = req.params.orderId;
  const query = `SELECT * FROM orderDetails WHERE orderId=${orderId}`;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.log(
        `Error retrieving orders from database for orderId=${orderId}`
      );
      return res
        .status(500)
        .json({ error: "Infernal error retrieving order details" });
    }

    return res.status(200).json(rows);
  });
});

router.route("/:orderId/:productId").delete((req, res) => {
  const { orderId, productId } = req.params;

  const query = `DELETE FROM orderDetails WHERE orderId=? AND productId=?`;

  db.run(query, [orderId, productId], function (err) {
    if (err) {
      console.log(
        `Error deleting orderDetails for orderId=${orderId} and productId=${productId}`
      );
      return res
        .status(500)
        .json({ error: "Infernal error deleting order detail from database" });
    }

    if (this.changes === 0)
      return res
        .status(404)
        .json({ error: "No matching records found to delete" });

    console.log(
      `Order detail deleted successfully for orderId=${orderId}, productId=${productId}`
    );

    return res
      .status(200)
      .json({ status: "Order detail deleted successfully" });
  });
});

module.exports = router;
