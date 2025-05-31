// src/services/api.js - Configuration des appels API
import axios from 'axios';

// Configuration de base d'Axios
const api = axios.create({
  baseURL: 'http://192.168.100.6:5000/api', // URL de votre backend
  timeout: 10000, // Timeout de 10 secondes
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour les requêtes (ajouter des logs, modifier les headers, etc.)
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses (gérer les erreurs globalement)
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    
    // Gestion spécifique des erreurs
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      console.log('Token expiré, redirection vers login...');
      // Ici vous pourriez déclencher une déconnexion automatique
    }
    
    return Promise.reject(error);
  }
);

export default api;