const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const { createUser, getUser } = require("../queries/user.queries");
require("dotenv").config();

const cryptedEmail = (reqEmail) => CryptoJS.HmacSHA256(reqEmail, process.env.CRYPTO_KEY).toString();

exports.signup = async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    await createUser(cryptedEmail(req.body.email), hash);
    res.status(201).json({ message: "Utilisateur créé !" });
  } catch (err) {
    res.status(400).json({ err });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await getUser(cryptedEmail(req.body.email));
    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!user) {
      return res.status(401).json({ error: "Utilisateur non trouvé !" });
    } else if (!valid) {
      return res.status(401).json({ error: "Mot de passe incorrect !" });
    }
    res.status(200).json({
      userId: user._id,
      token: jwt.sign({ userId: user._id }, process.env.JWT_TOKEN, {
        expiresIn: "24h",
      }),
    });
  } catch (err) {
    res.status(500).json(err);
  }
};
