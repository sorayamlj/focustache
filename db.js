// backend/config/db.js

const mongoose = require('mongoose');

/**
 * connectDB
 * Se connecte à MongoDB en utilisant l'URI de .env (ou la valeur par défaut).
 * Affiche le statut de connexion en console.
 */
const connectDB = async () => {
  try {
    console.log('🔄 Tentative de connexion à MongoDB...');
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/focustache',
      {
        useNewUrlParser: true,      // Nouveau parser URL Mongo
        useUnifiedTopology: true,   // Nouveau moteur de gestion des connexions
      }
    );
    console.log(`✅ MongoDB connecté sur : ${conn.connection.host}`);
    console.log(`📦 Base de données : ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ Échec de la connexion MongoDB :', error.message);
    process.exit(1);  // Arrêt de l’app si la BDD est inaccessible
  }
};

module.exports = connectDB;
