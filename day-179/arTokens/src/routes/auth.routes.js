let express = require('express');
let router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const {
  registerController,
  loginController,
  getAccessTokenController,
} = require('../controllers/auth.controller');

router.get('/me', authMiddleware, (req, res) => {
  return res.status(200).json({
    message: 'currently loggedIn user',
    user: req.user,
  });
});

router.get('/get-accessToken', getAccessTokenController);

router.post('/register', registerController);
router.post('/login', loginController);

module.exports = router;
