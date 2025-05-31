// backend/routes/auth.js

const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Enregistrer un nouvel utilisateur
 * @access  Public
 */
router.post('/register', registerUser);

/**
 * @route   POST /api/auth/login
 * @desc    Authentifier un utilisateur existant
 * @access  Public
 */
router.post('/login', loginUser);

module.exports = router;
