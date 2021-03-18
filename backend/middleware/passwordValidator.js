const passwordValidator = require("password-validator");

const schema = new passwordValidator()
  .is()
  .min(8)
  .is()
  .max(30)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits(1)
  .has()
  .symbols(1)
  .has()
  .not()
  .spaces();

module.exports = (req, res, next) => {
  const passwordErrors = schema.validate(req.body.password, { list: true });
  if (passwordErrors.length) {
    return res.status(417).json({
      message: passwordErrors.reduce((acc, curr, i) => {
        return acc + ` ${curr}${i === passwordErrors.length - 1 ? "." : " ;"}`;
      }, `Votre mot de passe est trop faible et contient ${passwordErrors.length > 1 ? "les erreurs suivantes" : "l'erreur suivante"} : `),
    });
  }
  next();
};
