import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { colors, spacing } from '../lib/theme';

export default function ShopScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shop</Text>
      <Card>
        <Text style={styles.text}>Integrare Stripe urmează. Aici vom afișa pachetele și vom deschide Stripe Payment Sheet.</Text>
        <View style={{ height: spacing.lg }} />
        <Button title="Cumpără pack" onPress={() => {}} />
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
