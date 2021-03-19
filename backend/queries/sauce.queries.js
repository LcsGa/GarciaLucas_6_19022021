const Sauce = require("../database/models/Sauce");

exports.createSauce = (sauce, req) => {
  const sauceObject = JSON.parse(sauce);
  const newSauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
  });
  return newSauce.save();
};

exports.getSauces = () => {
  return Sauce.find();
};

exports.getSauce = (sauceId) => {
  return Sauce.findOne({ _id: sauceId });
};

exports.modifySauce = (sauceId, req) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      }
    : { ...req.body };
  return Sauce.updateOne({ _id: sauceId }, { ...sauceObject, _id: req.params.id });
};

exports.likeSauce = (sauce) => {
  return Sauce.updateOne(
    { _id: sauce._id },
    {
      usersLiked: sauce.usersLiked,
      usersDisliked: sauce.usersDisliked,
      likes: sauce.usersLiked.length,
      dislikes: sauce.usersDisliked.length,
    }
  );
};

exports.deleteSauce = (sauceId) => {
  return Sauce.deleteOne({ _id: sauceId });
};
