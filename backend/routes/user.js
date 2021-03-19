const router = require("express").Router();
const passwordValidate = require("../middleware/passwordValidator");
const limiter = require("../middleware/rateLimit");

const { signup, login } = require("../controllers/user.controller");

router.post("/signup", passwordValidate, signup);
router.post("/login", limiter, login);

module.exports = router;
