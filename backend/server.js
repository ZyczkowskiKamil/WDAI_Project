const express = require("express");
const cors = require("cors");
require("dotenv").config(); // for accessing env variables

const PORT = process.env.SERVERPORT || 8080;

const app = express();
const corsOptions = {
  origin: ["http://localhost:5173"],
};
app.use(cors(corsOptions));
app.use(express.json());

const userRouter = require("./routes/users");
app.use("/users", userRouter);
const productsRouter = require("./routes/products");
app.use("/products", productsRouter);
const commentsRouter = require("./routes/comments");
app.use("/comments", commentsRouter);
const categoriesRouter = require("./routes/categories");
app.use("/categories", categoriesRouter);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
