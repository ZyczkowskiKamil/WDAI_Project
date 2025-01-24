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

router.post("/placeOrderWithCart", async (req, res) => {
  const { jwtToken, cartBref } = req.body;

  if (!jwtToken) {
    return res.status(401).json({ message: "JWT Token is required" });
  }

  try {
    const decoded = jwt.verify(jwtToken, process.env.JWTSECRETKEY);

    // token is ok

    const insertOrder = () => {
      return new Promise((resolve, reject) => {
        const orderQuery = `INSERT INTO orders (userId, orderDate, paidDate, paid, completed) VALUES (${
          decoded.userId
        }, ${Date.now()}, null, 0, 0)`;

        db.run(orderQuery, [], function (err) {
          if (err) {
            console.log("Error inserting data into orders: ", err.message);
            return res
              .status(500)
              .json({ error: "Error adding order to database" });
          }

          console.log(
            `Order added successfully to database with id=${this.lastID}`
          );
          resolve(this.lastID);
        });
      });
    };

    const inserOrderDetails = (orderId) => {
      const orderDetailsQuery = `INSERT INTO orderDetails (orderId, productId, quantity, pricePerUnit) VALUES (${orderId},?,?,?)`;

      cartBref.map((element) => {
        db.run(
          orderDetailsQuery,
          [element.id, element.priceAfterDiscount, element.quantity],
          function (err) {
            if (err) {
              console.log(
                `Error adding order details: product with id=${element.id} to order with id=${orderId}`
              );
            }
          }
        );
      });
    };

    const orderId = await insertOrder();
    inserOrderDetails(orderId);

    return res.status(200);
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired jwt token" });
  }
});

module.exports = router;
