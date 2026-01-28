import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../components/ui/Card';
import { colors, spacing } from '../lib/theme';

export default function WalletScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wallet</Text>
      <Card>
        <Text style={styles.balanceLabel}>Sold curent</Text>
        <Text style={styles.balance}>120 lei</Text>
        <Text style={styles.text}>Aici vom încărca istoricul tranzacțiilor și top-up prin Stripe.</Text>
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
  balanceLabel: {
    color: colors.muted,
    fontSize: 14
  },
  balance: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: spacing.md
  },
  text: {
    color: colors.muted,
    fontSize: 15
  }
});
