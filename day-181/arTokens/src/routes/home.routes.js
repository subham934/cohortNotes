const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");

router.get("/", authMiddleware, (req, res) => {
  return res.status(200).json({ message: "Home fetched"});
});

module.exports = router;