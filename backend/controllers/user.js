const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
require("dotenv").config();

const User = require("../models/User");

const cryptedEmail = (reqEmail) => CryptoJS.HmacSHA256(reqEmail, process.env.CRYPTO_KEY).toString();

exports.signup = (req, res) => {
  if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+!*$@%_])([-+!*$@%_\w]{8,15})$/.test(req.body.password)) {
    return res.status(417).json({
      message:
        "Votre mot de passe est trop faible ! Celui-ci doit faire entre 8 et 15 caractères (inclus) et contenir au moins : 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial !",
    });
  }
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: cryptedEmail(req.body.email),
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((err) => res.status(400).json({ err }));
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
};

exports.login = (req, res) => {
  User.findOne({ email: cryptedEmail(req.body.email) })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, process.env.JWT_TOKEN, {
              expiresIn: "24h",
            }),
          });
        })
        .catch((err) => res.status(500).json({ err }));
    })
    .catch((err) => res.status(500).json({ err }));
};
