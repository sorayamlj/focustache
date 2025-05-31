// src/screens/RegisterScreen.js - Écran d'inscription
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  
  const { register, loading } = useAuth();

  // Validation des champs
  const validateForm = () => {
    const newErrors = {};

    // Validation nom
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Le nom doit contenir au moins 2 caractères';
    }

    // Validation email
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    // Validation mot de passe
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    // Validation confirmation mot de passe
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Veuillez confirmer votre mot de passe';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async () => {
    if (!validateForm()) return;

    const result = await register(
      formData.name,
      formData.email,
      formData.password
    );
    
    if (!result.success) {
      // Les erreurs sont déjà gérées dans le contexte AuthContext
      console.log('Échec de l\'inscription');
    }
  };

  // Mise à jour des champs du formulaire
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Effacer l'erreur quand l'utilisateur commence à taper
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.content}>
            
            {/* En-tête */}
            <View style={styles.header}>
              <Text style={styles.title}>Créer un compte</Text>
              <Text style={styles.subtitle}>
                Rejoignez FocusTâche et organisez vos tâches efficacement
              </Text>
            </View>

            {/* Formulaire */}
            <View style={styles.form}>
              <Input
                label="Nom complet"
                value={formData.name}
                onChangeText={(value) => updateField('name', value)}
                placeholder="Jean Dupont"
                autoCapitalize="words"
                error={errors.name}
              />

              <Input
                label="Email"
                value={formData.email}
                onChangeText={(value) => updateField('email', value)}
                placeholder="votre@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
              />

              <Input
                label="Mot de passe"
                value={formData.password}
                onChangeText={(value) => updateField('password', value)}
                placeholder="Minimum 6 caractères"
                secureTextEntry
                error={errors.password}
              />

              <Input
                label="Confirmer le mot de passe"
                value={formData.confirmPassword}
                onChangeText={(value) => updateField('confirmPassword', value)}
                placeholder="Répétez votre mot de passe"
                secureTextEntry
                error={errors.confirmPassword}
              />

              <Button
                title="S'inscrire"
                onPress={handleSubmit}
                loading={loading}
                style={styles.registerButton}
              />
            </View>

            {/* Lien vers connexion */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Déjà un compte ?{' '}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.linkText}>Se connecter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  form: {
    marginBottom: 30,
  },
  registerButton: {
    marginTop: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e1e8ed',
  },
  footerText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  linkText: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '600',
  },
});

export default RegisterScreen;