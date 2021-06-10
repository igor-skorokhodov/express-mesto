const mongoose  = require('mongoose');
const ObjectId = require('mongodb').ObjectID;
const reg = /^(http|https):\/\/[^ "]+$/;

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: function(link) {
        return reg.test(link);
      },
      message: props => `${props.value} некорректный url`
    },
  },
  owner: {
    type: String,

  },
  likes: {
    type: Array,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('card', cardSchema)