// src/navigation/AppNavigator.js - Navigation principale
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

// Import des écrans
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated, loading } = useAuth();

  // Écran de chargement pendant la vérification de l'authentification
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4F46E5',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {isAuthenticated ? (
        // Écrans pour utilisateur connecté
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ 
            title: 'FocusTâche',
            headerLeft: null, // Empêche le retour arrière
          }}
        />
      ) : (
        // Écrans pour utilisateur non connecté
        <>
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ 
              title: 'Connexion',
              headerShown: false, // Masquer l'en-tête sur l'écran de connexion
            }}
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen} 
            options={{ 
              title: 'Inscription',
              headerShown: false, // Masquer l'en-tête sur l'écran d'inscription
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;