const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const db = require('./config/db');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(routes);

db.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });