import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image, Platform } from 'react-native';
import axios from 'axios';
import { globalStyles } from '../styles/global';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL
  ? (Platform.OS === 'android'
    ? process.env.EXPO_PUBLIC_API_URL.replace('localhost', '10.0.2.2')
    : process.env.EXPO_PUBLIC_API_URL)
  : (Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000');
const API_URL = `${API_BASE_URL.replace(/\/$/, '')}/api/auth`;

const getSignupErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.message) return error.response.data.message;
    if (error.response?.data?.error) return error.response.data.error;
    if (error.response?.status) return `Erro ${error.response.status} ao criar conta.`;
    if (error.message) return error.message;
  }

  return 'Erro ao criar conta. Tente novamente.';
};

interface SignupScreenProps {
  onNavigateToLogin: () => void;
}

export default function SignupScreen({ onNavigateToLogin }: SignupScreenProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSignup = async () => {
    setMessage('');

    if (!name || !email || !password) {
      setMessage('Por favor, preencha todos os campos.');
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/signup`, { email, password });
      Alert.alert('Sucesso', 'Conta criada com sucesso! Você já pode fazer login.');
      onNavigateToLogin();
    } catch (error) {
      setMessage(getSignupErrorMessage(error));
      Alert.alert('Erro', 'Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/task-app-banner.png')} style={styles.logo} />
      <Text style={styles.title}>Crie sua conta</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {!!message && <Text style={styles.messageText}>{message}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Criar Conta</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={onNavigateToLogin} style={styles.linkButton}>
        <Text style={styles.linkText}>Já tem uma conta? Entre aqui</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: globalStyles.backgroundColor,
  },
  logo: {
    width: 60,
    height: 60,
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  messageText: {
    color: '#d9363e',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  linkText: {
    color: '#333',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
