// server.js - Version corrigée pour app mobile
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();

console.log('--- CONFIG CHARGÉE ---');
console.log('NODE_ENV    =', process.env.NODE_ENV);
console.log('JWT_SECRET  =', process.env.JWT_SECRET ? '[OK]' : '[MANQUANT]');
console.log('MONGODB_URI =', process.env.MONGODB_URI ? '[OK]' : '[MANQUANT]');
console.log('-----------------------');

const app = express();

// CORS pour mobile - Plus permissif
app.use(cors({
    origin: '*', // Permet toutes les origines pour mobile
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 🔴 COMMENTÉ - Pas besoin pour app mobile pure
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes API
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/users', require('./routes/users'));

// Route de base pour mobile
app.get('/', (req, res) => {
    res.json({
        message: '🎯 FocusTâche API pour Mobile!',
        version: '1.0.0',
        status: 'Serveur actif',
        type: 'Mobile API',
        endpoints: {
            auth: '/api/auth',
            tasks: '/api/tasks',
            users: '/api/users'
        }
    });
});

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

// Routes 404
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route non trouvée',
        message: `La route ${req.method} ${req.originalUrl} n'existe pas`,
        availableRoutes: [
            'GET /',
            'GET /health',
            'POST /api/auth/login',
            'POST /api/auth/register',
            'GET /api/auth/verify',
            'GET /api/tasks',
            'POST /api/tasks'
        ]
    });
});

// Gestion des erreurs
app.use((error, req, res, next) => {
    console.error('❌ Erreur capturée :', error.stack);
    res.status(error.status || 500).json({
        error: error.message || 'Erreur serveur interne',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();
        
        const server = app.listen(PORT, '0.0.0.0', () => { // 🔴 Écoute sur toutes les interfaces
            console.log('🚀 ================================');
            console.log(`🎯 FocusTâche Mobile API démarré!`);
            console.log(`🌐 Local: http://localhost:${PORT}`);
            console.log(`🌐 Network: http://192.168.10.39:${PORT}`); // Votre IP
            console.log(`📱 Mobile API Ready`);
            console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`⏰ Démarré à: ${new Date().toLocaleString('fr-FR')}`);
            console.log('🚀 ================================');
        });

        process.on('SIGTERM', () => {
            console.log('🛑 SIGTERM reçu, arrêt du serveur...');
            server.close(() => {
                console.log('✅ Serveur fermé proprement');
                mongoose.connection.close();
                process.exit(0);
            });
        });

        process.on('SIGINT', () => {
            console.log('🛑 SIGINT reçu (Ctrl+C), arrêt du serveur...');
            server.close(() => {
                console.log('✅ Serveur fermé proprement');
                mongoose.connection.close();
                process.exit(0);
            });
        });

    } catch (error) {
        console.error('❌ Impossible de démarrer le serveur:', error);
        process.exit(1);
    }
};

startServer();

module.exports = app;