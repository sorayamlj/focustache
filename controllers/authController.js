// backend/controllers/authController.js

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt   = require('jsonwebtoken');

/**
 * @desc    Enregistrer un nouvel utilisateur
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // 1. Vérifier que tous les champs sont présents
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    // 2. Vérifier qu’aucun compte n’existe déjà pour cet email
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }

    // 3. Hasher le mot de passe
    const salt     = await bcrypt.genSalt(10);
    const hashedPw = await bcrypt.hash(password, salt);

    // 4. Créer l’utilisateur
    const newUser = await User.create({
      name,
      email,
      password: hashedPw
    });

    // 5. Générer un token JWT
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 6. Répondre avec le token et les infos basiques
    res.status(201).json({
      token,
      user: {
        id:    newUser._id,
        name:  newUser.name,
        email: newUser.email
      }
    });

  } catch (error) {
    next(error); // passe l’erreur au middleware global
  }
};


/**
 * @desc    Authentifier un utilisateur existant
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Vérifier champs
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis.' });
    }

    // 2. Chercher l’utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }

    // 3. Comparer le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }

    // 4. Générer et renvoyer un token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id:    user._id,
        name:  user.name,
        email: user.email
      }
    });

  } catch (error) {
    next(error);
  }
};
