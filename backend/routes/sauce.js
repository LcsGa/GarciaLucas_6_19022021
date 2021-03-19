const express = require("express");
const router = express.Router();

const {
  sauceCreate,
  saucesList,
  sauce,
  sauceModify,
  sauceDelete,
  sauceLike,
} = require("../controllers/sauce.controller");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer.config");

router.post("/", auth, multer, sauceCreate);
router.get("/", auth, saucesList);
router.get("/:id", auth, sauce);
router.put("/:id", auth, multer, sauceModify);
router.delete("/:id", auth, sauceDelete);
router.post("/:id/like", auth, sauceLike);

module.exports = router;
