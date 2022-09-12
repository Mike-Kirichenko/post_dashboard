require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { conn } = require("./db/config");
const { User, Category, Post } = require("./db/models");

const { PORT } = process.env;
const app = express();

const start = async () => {
  try {
    await conn.authenticate();
    await conn.sync();
    app.listen(PORT);
    console.log(`Server started on port ${PORT}`);
  } catch (error) {
    console.log(error);
  }
};

start();

app.use(cors());
app.use(express.json());

app.post("/g", (req, res) => {
  res.send({ msg: "ok" });
});
