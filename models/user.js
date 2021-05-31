const mongoose  = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    requird: true,
    minlength: 2,
    maxlength: 30
  },
  about: {
    type: String,
    requird: true,
    minlength: 2,
    maxlength: 30
  },
  avatar: {
    type: String,
    requird: true,
  },
})

module.exports = mongoose.model('User', userSchema)