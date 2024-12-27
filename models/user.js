const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

// Configure passport-local-mongoose to use email as the username field
userSchema.plugin(passportLocalMongoose, {
  usernameField: 'email', // Use email as the unique identifier for login
});

// User Model
const User = mongoose.model('User', userSchema);

module.exports = User;
