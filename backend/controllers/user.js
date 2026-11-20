const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.signup = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const missing = [!email && 'email', !password && 'password'].filter(Boolean).join(' and ');
    return res.status(400).json({ message: `Missing ${missing}` });
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    await new User({ email, password: hash }).save();
    return res.status(201).json({ message: 'User created' });
  } catch (error) {
    if (error.errors?.email?.kind === 'unique') {
      return res.status(409).json({ message: 'This email is already registered' });
    }
    return res.status(400).json({ message: error.message, error });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(401).json({ message: 'Incorrect email or password' });
    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) return res.status(401).json({ message: 'Incorrect email or password' });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return res.status(200).json({ userId: user._id, token });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
