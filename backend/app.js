const express = require('express');
const cors = require('cors');
const path = require('path');
const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');

const app = express();

// Error objects have no enumerable `message`, so they would serialize to {}.
app.set('json replacer', (key, value) => (
  value instanceof Error ? { ...value, name: value.name, message: value.message } : value
));

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;
