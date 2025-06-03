const express = require('express');
require('dotenv').config();
const db = require('./db');
const schoolRoutes = require('./routes/schoolroute');

const app = express();
app.use(express.json());
app.use('/', schoolRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
