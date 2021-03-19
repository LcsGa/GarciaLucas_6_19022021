const rateLimit = require("express-rate-limit");

module.exports = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Vous vous êtes trompé 5 fois de mot de passe ! Réessayez dans 15 minutes !",
  skipSuccessfulRequests: true,
});
