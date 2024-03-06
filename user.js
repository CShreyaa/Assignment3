const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'author'],
    default: 'user',
  },
});
const User = mongoose.model('User', userSchema);

module.exports = User;