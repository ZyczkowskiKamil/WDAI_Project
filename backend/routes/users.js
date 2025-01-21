const express = require("express");
const sqlite3 = require("sqlite3");
const router = express.Router();

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
  .post((req, res) => {
    const query =
      "INSERT INTO users (Login, Password, FirstName, LastName, Email) VALUES (?,?,?,?,?)";

    const { login, password, firstName, lastName, email } = req.body;

    if (!login || !password || !firstName || !lastName || !email) {
      return res.status(400).json({
        error:
          "Login, password, first name, last name and email need to be specified",
      });
    }

    db.run(
      query,
      [login, password, firstName, lastName, email],
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

// router.param("id", (req, res, next, id) => {
//   // run when id is found
//   // req.id = id;
//   next();
// });

module.exports = router;
