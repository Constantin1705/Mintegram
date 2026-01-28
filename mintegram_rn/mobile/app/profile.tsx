import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { colors, spacing } from '../lib/theme';

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Profil</Text>
      <Card>
        <Text style={styles.label}>Nume</Text>
        <Text style={styles.value}>Player Mintegram</Text>

        <View style={{ height: spacing.md }} />
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>mail@exemplu.com</Text>

        <View style={{ height: spacing.lg }} />
        <Button title="Editează profil" onPress={() => {}} />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.xl
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: spacing.lg
  },
  label: {
    color: colors.muted,
    fontSize: 14,
    marginBottom: spacing.xs
  },
  value: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600'
  }
});
