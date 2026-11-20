const fs = require('fs');
const path = require('path');
const Book = require('../models/Book');

const imageUrlFor = (req, filename) => `${req.protocol}://${req.get('host')}/images/${filename}`;

const removeImage = (imageUrl) => {
  const filename = imageUrl.split('/images/')[1];
  if (filename) fs.unlink(path.join(__dirname, '..', 'images', filename), () => {});
};

const average = (ratings) => {
  if (!ratings.length) return 0;
  const sum = ratings.reduce((total, r) => total + r.grade, 0);
  return Math.round((sum / ratings.length) * 100) / 100;
};

exports.getAllBooks = async (req, res) => {
  try {
    res.status(200).json(await Book.find());
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.getOneBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: new Error('Book not found') });
    return res.status(200).json(book);
  } catch (error) {
    return res.status(400).json({ error });
  }
};

exports.getBestRating = async (req, res) => {
  try {
    res.status(200).json(await Book.find().sort({ averageRating: -1 }).limit(3));
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.createBook = async (req, res) => {
  try {
    if (!req.file) throw new Error('Image is required');
    const { _id, userId, ratings, averageRating, ...data } = JSON.parse(req.body.book);
    // The frontend sends the creator's own initial grade; keep it only if it is a real one.
    const initial = (ratings || []).filter((r) => r.grade > 0).slice(0, 1)
      .map((r) => ({ userId: req.auth.userId, grade: r.grade }));
    const book = new Book({
      ...data,
      userId: req.auth.userId,
      imageUrl: imageUrlFor(req, req.file.filename),
      ratings: initial,
      averageRating: average(initial),
    });
    await book.save();
    res.status(201).json({ message: 'Book saved' });
  } catch (error) {
    if (req.file) removeImage(req.file.filename);
    res.status(400).json({ error });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) throw new Error('Book not found');
    if (book.userId !== req.auth.userId) {
      return res.status(403).json({ error: new Error('403: unauthorized request') });
    }
    const body = req.file ? JSON.parse(req.body.book) : req.body;
    const { title, author, year, genre } = body;
    const update = { title, author, year, genre };
    if (req.file) update.imageUrl = imageUrlFor(req, req.file.filename);
    await Book.updateOne({ _id: req.params.id }, update, { runValidators: true });
    if (req.file) removeImage(book.imageUrl);
    return res.status(200).json({ message: 'Book updated' });
  } catch (error) {
    if (req.file) removeImage(req.file.filename);
    return res.status(400).json({ error });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) throw new Error('Book not found');
    if (book.userId !== req.auth.userId) {
      return res.status(403).json({ error: new Error('403: unauthorized request') });
    }
    await Book.deleteOne({ _id: req.params.id });
    removeImage(book.imageUrl);
    return res.status(200).json({ message: 'Book deleted' });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

exports.rateBook = async (req, res) => {
  try {
    const grade = Number(req.body.rating);
    if (!Number.isFinite(grade) || grade < 0 || grade > 5) throw new Error('Rating must be between 0 and 5');
    const book = await Book.findById(req.params.id);
    if (!book) throw new Error('Book not found');
    // The user comes from the verified token, never from the request body.
    if (book.ratings.some((r) => r.userId === req.auth.userId)) {
      throw new Error('Book already rated by this user');
    }
    book.ratings.push({ userId: req.auth.userId, grade });
    book.averageRating = average(book.ratings);
    await book.save();
    return res.status(200).json(book);
  } catch (error) {
    return res.status(400).json({ error });
  }
};
