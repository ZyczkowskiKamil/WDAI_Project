const express = require("express");
const sqlite3 = require("sqlite3");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config(); // for accessing env variables

const db = new sqlite3.Database("database.db");

router.use(express.json());

router.post("/verify-jwt-token", (req, res) => {
  const jwtToken = req.body.jwtToken;

  if (!jwtToken) {
    return res.status(401).json({ message: "JWT Token is required" });
  }

  try {
    const decoded = jwt.verify(jwtToken, process.env.JWTSECRETKEY);

    return res
      .status(200)
      .json({ message: "JWT token is valid", userId: decoded.userId });
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired jwt token" });
  }
});

module.exports = router;
