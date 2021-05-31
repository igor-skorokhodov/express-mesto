const Card = require("../models/card.js");
const reg = /^(ftp|http|https):\/\/[^ "]+$/;

function getCards(req, res) {
  return Card.find({}).then((cards) =>
    res
      .status(200)
      .send(cards)
      .catch((err) => {
        res.status(500).send({ message: "На сервере произошла ошибка!" });
      })
  );
}

function createCard(req, res) {
  return Card.create({...req.body})
    .then((card) => {
      if (!reg.test(req.body.link)) {
        res.status(400).send({ message: "Введены некорректные данные!" });
      }
      else {
      res.status(200).send({ data: card });
      }
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send({ message: "На сервере произошла ошибка!" });
    });
}

function deleteCard(req, res) {
  const id = req.params.cardId;
  return Card.findByIdAndRemove(id)
  .then((card) => {
    if (card) {
      return res.status(200).send({data: card});
    }
    return res.status(404).send({ message: "Нет такой карточки!" });
  })
    .catch((err) =>
      res.status(500).send({ message: "На сервере произошла ошибка!" })
    );
}

function likeCard(req, res) {

  return Card.findByIdAndUpdate( req.params.cardId,
    { $addToSet: { likes: req.body.user._id }},
    { new: true })
    .then((card) => {
      if (card) {
        return res.status(200).send({data: card});
      }
      return res.status(404).send({ message: "Нет такой карточки!" });
    })
    .catch((err) => {
    console.log(err)
      res.status(500).send({ message: "На сервере произошла ошибка!" })
    });
}

function dislikeCard(req, res) {

  return Card.findByIdAndUpdate( req.params.cardId,
    { $pull: { likes: req.body.user._id }},
    { new: true })
    .then((card) => {
      if (card) {
        return res.status(200).send({data: card});
      }
      return res.status(404).send({ message: "Нет такой карточки!" });
    })
    .catch((err) =>
      res.status(500).send({ message: "На сервере произошла ошибка!" })
    );
}


module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard
}
