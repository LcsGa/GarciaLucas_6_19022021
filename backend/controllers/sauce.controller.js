const fs = require("fs");
const { createSauce, getSauces, getSauce, modifySauce, likeSauce, deleteSauce } = require("../queries/sauce.queries");

exports.sauceCreate = async (req, res) => {
  try {
    await createSauce(req.body.sauce, req);
    res.status(201).json({ message: "Sauce enregistrée !" });
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.saucesList = async (_req, res) => {
  try {
    const sauces = await getSauces();
    res.status(200).json(sauces);
  } catch (err) {
    res.status(404).json(err);
  }
};

exports.sauce = async (req, res) => {
  try {
    const sauce = await getSauce(req.params.id);
    res.status(200).json(sauce);
  } catch (err) {
    res.status(404).json(err);
  }
};

exports.sauceModify = (req, res) => {
  deleteSauceImage(req, res, async () => {
    try {
      await modifySauce(req.params.id, req);
      res.status(200).json({ message: "Sauce modifiée !" });
    } catch (err) {
      res.status(404).json(err);
    }
  });
};

exports.sauceDelete = (req, res) => {
  deleteSauceImage(req, res, async () => {
    try {
      await deleteSauce(req.params.id);
      res.status(200).json({ message: "Sauce supprimée !" });
    } catch (err) {
      res.status(400).json(err);
    }
  });
};

exports.sauceLike = async (req, res) => {
  try {
    const sauce = await getSauce(req.params.id);
    try {
      const sauceLiked = applySauceLike(sauce, req.body.userId, req.body.like);
      await likeSauce(sauceLiked.sauce);
      res.status(201).json({ message: sauceLiked.message });
    } catch (err) {
      res.status(404).json(err);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteSauceImage = async (req, res, callback) => {
  try {
    const sauce = await getSauce(req.params.id);
    const filename = sauce.imageUrl.split("/images/")[1];
    fs.unlink(`images/${filename}`, callback);
  } catch (err) {
    res.status(500).json(err);
  }
};

const applySauceLike = (sauce, userId, like) => {
  let message;
  switch (like) {
    case 1:
      sauce.usersLiked.push(userId);
      message = "Sauce likée !";
      break;
    case -1:
      sauce.usersDisliked.push(userId);
      message = "Sauce dislikée !";
      break;
    case 0: {
      ["usersLiked", "usersDisliked"].forEach(
        (opinion) => (sauce[opinion] = sauce[opinion].filter((currUserId) => currUserId !== userId))
      );
      message = "Aucun avis sur la sauce !";
    }
  }
  return { sauce, message };
};
