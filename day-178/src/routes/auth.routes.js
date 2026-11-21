let express = require('express');
let router = express.Router();
const {
  registerController,
  loginController,
  getAccessTokenController,
} = require('../controllers/auth.controller');


router.get("/get-accessToken", getAccessTokenController);

router.post('/register', registerController);
router.post('/login', loginController);

module.exports = router;
