const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('user');
const secretKey = process.env.SECRET_KEY;

exports.createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id, username: user.username }, secretKey, { expiresIn: '1h' });

    res.json({ message: 'Login successful', user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.register = async (req, res) => {
    const { username, password, role } = req.body;
  
    try {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, password: hashedPassword, role });
      const savedUser = await newUser.save();
      const token = jwt.sign(
        { userId: savedUser._id, username: savedUser.username, role: savedUser.role },
        secretKey,
        { expiresIn: '1h' }
      );
  
      res.status(201).json({ user: savedUser, token });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const token = jwt.sign(
    { userId: savedUser._id, username: savedUser.username, role: savedUser.role },
    secretKey,
    { expiresIn: '1h' }
  );
  
  res.status(201).json({ user: savedUser, token });