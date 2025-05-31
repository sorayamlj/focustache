// src/context/AuthContext.js - Gestion globale de l'authentification
import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fonction pour sauvegarder le token de manière sécurisée
  const saveToken = async (token) => {
    try {
      await SecureStore.setItemAsync('userToken', token);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du token:', error);
    }
  };

  // Fonction pour récupérer le token sauvegardé
  const getToken = async () => {
    try {
      return await SecureStore.getItemAsync('userToken');
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error);
      return null;
    }
  };

  // Fonction pour supprimer le token
  const removeToken = async () => {
    try {
      await SecureStore.deleteItemAsync('userToken');
    } catch (error) {
      console.error('Erreur lors de la suppression du token:', error);
    }
  };

  // Fonction de connexion
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/login', {
        email: email.toLowerCase().trim(),
        password: password
      });

      const { token, user } = response.data;
      
      // Sauvegarder le token et les données utilisateur
      await saveToken(token);
      setToken(token);
      setUser(user);
      
      // Configurer l'en-tête d'autorisation pour les prochaines requêtes
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return { success: true };
    } catch (error) {
      console.error('Erreur de connexion:', error.response?.data || error.message);
      const message = error.response?.data?.message || 'Erreur de connexion';
      Alert.alert('Erreur', message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Fonction d'inscription
  const register = async (name, email, password) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/register', {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: password
      });

      const { token, user } = response.data;
      
      // Sauvegarder le token et les données utilisateur
      await saveToken(token);
      setToken(token);
      setUser(user);
      
      // Configurer l'en-tête d'autorisation
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      Alert.alert('Succès', 'Compte créé avec succès !');
      return { success: true };
    } catch (error) {
      console.error('Erreur d\'inscription:', error.response?.data || error.message);
      const message = error.response?.data?.message || 'Erreur lors de l\'inscription';
      Alert.alert('Erreur', message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Fonction de déconnexion
  const logout = async () => {
    try {
      await removeToken();
      setToken(null);
      setUser(null);
      delete api.defaults.headers.common['Authorization'];
      Alert.alert('Info', 'Vous avez été déconnecté');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Vérifier si l'utilisateur est déjà connecté au démarrage
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const savedToken = await getToken();
        if (savedToken) {
          // Configurer l'en-tête d'autorisation
          api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
          
          // Vérifier si le token est encore valide en récupérant les infos utilisateur
          try {
            const response = await api.get('/users/me');
            setToken(savedToken);
            setUser(response.data);
          } catch (error) {
            // Token invalide, on le supprime
            await removeToken();
            delete api.defaults.headers.common['Authorization'];
          }
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du token:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthState();
  }, []);

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
