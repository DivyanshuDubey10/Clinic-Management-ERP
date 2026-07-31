const express = require('express');
const { registerUser, loginUser, logoutUser, refreshToken, getUserProfile, updateUserProfile, forgotPassword, verifyResetOTP, resetPassword } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { validateBody } = require('../middlewares/validationMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/refresh', refreshToken);
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

router.post('/forgot-password', validateBody('email'), forgotPassword);
router.post('/verify-reset-otp', validateBody('email', 'otp'), verifyResetOTP);
router.post('/reset-password', validateBody('email', 'otp', 'newPassword'), resetPassword);



module.exports = router;
