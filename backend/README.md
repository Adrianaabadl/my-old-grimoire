# My Old Grimoire - Backend

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill in `MONGO_URI` and `JWT_SECRET`.
3. `npm run dev` (or `npm start`)

The API runs on `http://localhost:4000`.

## Dependencies

- express: server and routes
- mongoose: MongoDB connection and models
- bcrypt: password hashing
- jsonwebtoken: auth tokens
- multer: image uploads
- cors: front-end access (port 3000)
- dotenv: environment variables
- mongoose-unique-validator: unique email

## Dev Dependencies

- nodemon: auto-restart on changes


## Mongo Atlas

mongodb.com/cloud/atlas/register.



                                  server.js
                                     │ require('./app')
                                     ▼
                                   app.js
                      ┌──────────────┴──────────────┐
                      ▼                             ▼
              routes/book.js                 routes/user.js
              ┌─────┼──────────┐                    │
              ▼     ▼          ▼                    ▼
        middleware  middleware  controllers/   controllers/
        /auth.js    /multer-    book.js        user.js
                    config.js        │              │
                      │              ▼              ▼
                      ▼          models/        models/
                    (multer)     Book.js        User.js
                                     │              │
                                     └──────┬───────┘
                                            ▼
                                        mongoose ──► ☁️ Atlas


https://github.com/getify/you-dont-know-js

## API Methods

| Method + Path | Final URL | Handler Chain | Access |
|---|---|---|---|
| GET / | /api/books | getAllBooks | public |
| GET /bestrating | /api/books/bestrating | getBestRating | public |
| GET /:id | /api/books/:id | getOneBook | public |
| POST / | /api/books | auth → multer → createBook | protected |
| PUT /:id | /api/books/:id | auth → multer → updateBook | protected |
| DELETE /:id | /api/books/:id | auth → deleteBook | protected |
| POST /:id/rating | /api/books/:id/rating | auth → rateBook | protected |
