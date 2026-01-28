import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../components/ui/Button';
import { colors, radius, spacing } from '../lib/theme';

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    try {
      // TODO: call backend signup endpoint via api.post('/auth/signup')
      await new Promise((resolve) => setTimeout(resolve, 600));
      router.push('/integrame');
    } catch (error) {
      Alert.alert('Eroare', 'Nu am reușit să creăm contul.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Creează un cont</Text>
      <Text style={styles.subtitle}>Intră în comunitatea Mintegram.</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Nume</Text>
        <TextInput
          placeholder="Numele tău"
          placeholderTextColor={colors.muted}
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="mail@exemplu.com"
          placeholderTextColor={colors.muted}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Parolă</Text>
        <TextInput
          placeholder="••••••••"
          placeholderTextColor={colors.muted}
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <Button title="Creează cont" onPress={handleSignup} loading={loading} />
      <View style={{ height: spacing.lg }} />
      <Button title="Am deja cont" variant="secondary" onPress={() => router.push('/login')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: spacing.xl,
    backgroundColor: colors.background
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: spacing.sm
  },
  subtitle: {
    color: colors.muted,
    marginBottom: spacing.xl
  },
  field: {
    marginBottom: spacing.lg
  },
  label: {
    color: colors.text,
    marginBottom: spacing.sm,
    fontWeight: '600'
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    color: colors.text,
    backgroundColor: colors.card
  }
});
