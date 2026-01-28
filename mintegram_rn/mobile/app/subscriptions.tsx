import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { colors, spacing } from '../lib/theme';

export default function SubscriptionsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Abonamente</Text>
      <Card>
        <Text style={styles.text}>Configurează planuri și gestionează Stripe customer + subscription.</Text>
        <View style={{ height: spacing.lg }} />
        <Button title="Activează plan" onPress={() => {}} />
      </Card>
    </View>
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
  text: {
    color: colors.muted,
    fontSize: 15
  }
});
