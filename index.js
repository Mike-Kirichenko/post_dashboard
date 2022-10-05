require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const { conn } = require('./db/config');
const { login } = require('./auth');
const { startApollo } = require('./graphQL');

const app = express();

const start = async () => {
  try {
    await conn.authenticate();
    app.listen(process.env.PORT);
    console.log(`Server started on port ${process.env.PORT}`);
  } catch (error) {
    console.log(error);
  }
};

start();
startApollo(app);

app.use(cors());
app.use(express.json());
app.post('/api/user/login', login);
app.use(express.static(path.resolve(__dirname, 'uploads')));
