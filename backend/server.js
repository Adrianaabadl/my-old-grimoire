const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();
const fs = require('fs');
const path = require('path');
const app = require('./app');

const PORT = process.env.PORT || 4000;
fs.mkdirSync(path.join(__dirname, 'images'), { recursive: true });

mongoose
  .connect(process.env.MONGO_URI, { dbName: process.env.MONGO_DB_NAME })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  });
