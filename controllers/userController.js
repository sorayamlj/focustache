// backend/controllers/userController.js

const User = require('../models/User');
const bcrypt = require('bcryptjs');

/**
 * GET /api/users/me
 * Retourne les informations du user connecté
 */
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/users/me
 * Met à jour le profil (nom, email, mot de passe) de l'user connecté
 */
exports.updateMe = async (req, res, next) => {
  try {
    const updates = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.email) updates.email = req.body.email;
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(req.body.password, salt);
    }

    const user = await User.findByIdAndUpdate(req.userId, updates, { new: true })
                           .select('-password');
    res.json(user);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/users/me
 * Supprime le compte de l'user connecté
 */
exports.deleteMe = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.userId);
    res.json({ message: 'Compte supprimé' });
  } catch (err) {
    next(err);
  }
};
