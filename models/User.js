// backend/models/User.js

const mongoose = require('mongoose');  

/**
 * Schéma d’un utilisateur
 * - name     : nom complet (String, obligatoire)
 * - email    : adresse email (String, unique, obligatoire, en minuscules)
 * - password : mot de passe hashé (String, obligatoire)
 * avec timestamps pour createdAt et updatedAt.
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,     // champ obligatoire
    trim: true          // supprime les espaces avant/après
  },
  email: {
    type: String,
    required: true,
    unique: true,       // aucune duplication possible
    lowercase: true,    // stocké en minuscules
    trim: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true       // ajoute createdAt et updatedAt automatiquement
});

// On compile le schéma en modèle et on l’exporte
module.exports = mongoose.model('User', userSchema);
