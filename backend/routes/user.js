const router = require("express").Router();
const passwordValidate = require("../middleware/passwordValidator");
const limiter = require("../middleware/rateLimit");

const userCtrl = require("../controllers/user");

router.post("/signup", passwordValidate, userCtrl.signup);
router.post("/login", limiter, userCtrl.login);

module.exports = router;
