import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image, Platform } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';
import axios from 'axios';
import { globalStyles } from '../styles/global';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL
  ? (Platform.OS === 'android'
    ? process.env.EXPO_PUBLIC_API_URL.replace('localhost', '10.0.2.2')
    : process.env.EXPO_PUBLIC_API_URL)
  : (Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000');
const API_URL = `${API_BASE_URL.replace(/\/$/, '')}/api/auth`;

const getLoginErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.message) return error.response.data.message;
    if (error.response?.data?.error) return error.response.data.error;
    if (error.response?.status) return `Erro ${error.response.status} ao fazer login.`;
    if (error.message) return error.message;
  }

  return 'Credenciais inválidas ou erro no servidor.';
};

interface LoginScreenProps {
  onNavigateToSignup: () => void;
}

export default function LoginScreen({ onNavigateToSignup }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async () => {
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Por favor, preencha todos os campos.');
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      const { token, user } = response.data;
      
      setAuth(token, user);
    } catch (error) {
      setErrorMessage(getLoginErrorMessage(error));
      Alert.alert('Erro', 'Credenciais inválidas ou erro no servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/task-app-banner.png')} style={styles.logo} />
      <Text style={styles.title}>Bem-vindo de volta!</Text>
      
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

      {!!errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Entrar</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={onNavigateToSignup} style={styles.linkButton}>
        <Text style={styles.linkText}>Não tem uma conta? Cadastre-se</Text>
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
    width: 80,
    height: 80,
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
  errorText: {
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
