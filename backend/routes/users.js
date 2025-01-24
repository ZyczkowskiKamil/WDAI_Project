const express = require("express");
const sqlite3 = require("sqlite3");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // for accessing env variables

const db = new sqlite3.Database("database.db");

router.use(express.json());

router
  .route("/")
  .get((req, res) => {
    const query = "SELECT * FROM users";

    db.all(query, [], (err, rows) => {
      if (err) {
        console.log("Error retrieving users: ", err.message);
        return res
          .status(500)
          .json({ error: "An error occurred while retrieving users." });
      }

      return res.status(200).json(rows);
    });
  })
  .post(async (req, res) => {
    const query =
      "INSERT INTO users (login, password, firstName, lastName, email) VALUES (?,?,?,?,?)";

    const { login, password, firstName, lastName, email } = req.body;

    if (!login || !password || !firstName || !lastName || !email) {
      return res.status(400).json({
        error:
          "Login, password, first name, last name and email need to be specified",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: "Password length need to be at least 8 characters long",
      });
    }

    const hashPassword = async (plainPassword) => {
      try {
        const saltRounds = 10;
        return await bcrypt.hash(plainPassword, saltRounds);
      } catch (err) {
        return res.status(500).json({ error: "Error hashing password" });
      }
    };

    const hashedPassword = await hashPassword(password);

    db.run(
      query,
      [login, hashedPassword, firstName, lastName, email],
      function (err) {
        if (err) {
          console.log("Error inserting data: ", err.message);
          return res
            .status(500)
            .json({ error: "Error adding user to database" });
        }

        console.log(
          `User added successfully to database with id=${this.lastID}`
        );
        return res.status(201).json({ id: this.lastID });
      }
    );
  });

router
  .route("/getuserwithid/:id")
  .get((req, res) => {
    const userID = req.params.id;
    const query = `SELECT * FROM users WHERE id=${userID}`;

    db.get(query, [], (err, row) => {
      if (err) {
        console.log(`Error retrieving user with id=${userID}`);
        return res.status(500).json({
          error: `An error occured while retrieving user with id=${userID}`,
        });
      }

      if (row) {
        return res.status(200).json(row);
      } else {
        return res
          .status(404)
          .json({ error: `User with id=${userID} not found` });
      }
    });
  })
  .put((req, res) => {
    id = req.params.id;
    res.send(`Update user ${id}`);
  });

router.route("/getuserwithlogin/:login").get((req, res) => {
  const login = req.params.login;
  const query = `SELECT * FROM users WHERE LOWER(login)=LOWER('${login}')`;

  db.get(query, [], (err, row) => {
    if (err) {
      console.log(`Error retrieving user with login=${login}`, err);
      return res.status(500).json({
        error: `An error occured while retrieving user with login=${login}`,
      });
    }

    if (row) {
      return res.status(200).json(row);
    } else {
      return res
        .status(404)
        .json({ error: `User with login=${login} not found` });
    }
  });
});

router.route("/getuserwithemail/:email").get((req, res) => {
  const email = req.params.email;
  const query = `SELECT * FROM users WHERE LOWER(email)=LOWER('${email}')`;

  db.get(query, [], (err, row) => {
    if (err) {
      console.log(`Error retrieving user with email=${email}`, err);
      return res.status(500).json({
        error: `An error occured while retrieving user with email=${email}`,
      });
    }

    if (row) {
      return res.status(200).json(row);
    } else {
      return res
        .status(404)
        .json({ error: `User with email=${email} not found` });
    }
  });
});

router.route("/checkloginavailable/:login").get((req, res) => {
  const login = req.params.login;
  const query = `SELECT * FROM users WHERE LOWER(login)=LOWER('${login}')`;

  db.get(query, [], (err, row) => {
    if (err) {
      console.log(`Error checking availability for login=${login}`, err);
      return res.status(500).json({
        error: `An error occured while checking availability for login=${login}`,
      });
    }

    if (!row) {
      return res.status(200).json({ available: true });
    } else {
      return res.status(200).json({ available: false });
    }
  });
});

router.route("/checkemailavailable/:email").get((req, res) => {
  const email = req.params.email;
  const query = `SELECT * FROM users WHERE LOWER(email)=LOWER('${email}')`;

  db.get(query, [], (err, row) => {
    if (err) {
      console.log(`Error retrieving user with email=${email}`, err);
      return res.status(500).json({
        error: `An error occured while retrieving user with email=${email}`,
      });
    }

    db.get(query, [], (err, row) => {
      if (err) {
        console.log(`Error checking availability for email=${email}`, err);
        return res.status(500).json({
          error: `An error occured while checking availability for email=${email}`,
        });
      }

      if (!row) {
        return res.status(200).json({ available: true });
      } else {
        return res.status(200).json({ available: false });
      }
    });
  });
});

router.route("/authenticateLogin").post((req, res) => {
  const { login, password } = req.body;

  const getUserPasswordQuery = `SELECT id,password FROM users WHERE login='${login}'`;

  db.get(getUserPasswordQuery, [], async (err, row) => {
    if (err) {
      console.log("Infernal server error while authenticating user login", err);
      return res.status(500).json({ error: "Infernal server error" });
    }

    if (row) {
      try {
        const userId = row.id;
        const hashedPassword = row.password;

        const isPasswordMatching = await bcrypt.compare(
          password,
          hashedPassword
        );

        if (isPasswordMatching) {
          const payload = {
            userId: userId,
          };

          const SECRETKEY = process.env.JWTSECRETKEY;
          const jwtToken = jwt.sign(payload, SECRETKEY, { expiresIn: "1h" });

          return res.status(200).json({ jwtToken: jwtToken });
        } else {
          return res
            .status(400)
            .json({ error: "Incorrect username and password" });
        }
      } catch (err) {
        console.log("Error while authentication user");
        return res.status(500).json({ error: "Internal server error" });
      }
    } else {
      // maybe wait so attackers don't see if username is in database
      return res.status(400).json({ error: "Incorrect username and password" });
    }
  });
});

// router.param("id", (req, res, next, id) => {
//   // run when id is found
//   // req.id = id;
//   next();
// });

module.exports = router;
