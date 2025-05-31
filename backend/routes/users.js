// backend/routes/users.js

const express = require('express');
const { getMe, updateMe, deleteMe } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Toutes ces routes nécessitent d'être authentifié
router.use(authMiddleware);

// GET /api/users/me
router.get('/me', getMe);

// PUT /api/users/me
router.put('/me', updateMe);

// DELETE /api/users/me
router.delete('/me', deleteMe);

module.exports = router;
