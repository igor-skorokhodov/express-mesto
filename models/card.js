const mongoose = require('mongoose');
const validator = require('validator');
const ObjectId = require('mongodb').ObjectID;

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(link) {
        return validator.isURL(link);
      },
      message: (props) => `${props.value} некорректный url`,
    },
  },
  owner: {
    // eslint-disable-next-line no-undef
    type: ObjectId,
    required: true,
  },
  likes: {
    type: Array,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
