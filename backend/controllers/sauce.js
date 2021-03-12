const fs = require("fs");
const Sauce = require("../models/Sauce");

exports.createSauce = (req, res) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
    .catch((err) => res.status(400).json({ err }));
};

exports.getAllSauces = (_req, res) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((err) => res.status(404).json({ err }));
};

exports.getOneSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((err) => res.status(404).json({ err }));
};

const deleteSauceImage = (req, res, callback) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, callback);
    })
    .catch((err) => res.status(500).json({ err }));
};

exports.modifySauce = (req, res) => {
  deleteSauceImage(req, res, () => {
    const sauceObject = req.file
      ? {
          ...JSON.parse(req.body.sauce),
          imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        }
      : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
      .catch((err) => res.status(404).json({ err }));
  });
};

exports.deleteSauce = (req, res) => {
  deleteSauceImage(req, res, () => {
    Sauce.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
      .catch((err) => res.status(400).json({ err }));
  });
};

exports.likeSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      console.log(req.body);
      let message;
      switch (req.body.like) {
        case 1:
          sauce.usersLiked.push(req.body.userId);
          message = "Sauce likée !";
          break;
        case -1:
          sauce.usersDisliked.push(req.body.userId);
          message = "Sauce dislikée !";
          break;
        case 0: {
          ["usersLiked", "usersDisliked"].forEach(
            (opinion) => (sauce[opinion] = sauce[opinion].filter((userId) => userId !== req.body.userId))
          );
          message = "Aucun avis sur la sauce !";
        }
      }
      Sauce.updateOne(
        { _id: req.params.id },
        {
          usersLiked: sauce.usersLiked,
          usersDisliked: sauce.usersDisliked,
          likes: sauce.usersLiked.length,
          dislikes: sauce.usersDisliked.length,
          _id: req.params.id,
        }
      )
        .then(() => res.status(201).json({ message }))
        .catch((err) => res.status(404).json({ err }));
    })
    .catch((err) => res.status(500).json({ err }));
};
