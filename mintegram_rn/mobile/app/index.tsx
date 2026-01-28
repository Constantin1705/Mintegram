import * as React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { colors, spacing } from '../lib/theme';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} contentInsetAdjustmentBehavior="automatic">
      <Text style={styles.title}>Mintegram pe mobil</Text>
      <Text style={styles.subtitle}>Începe cu autentificare sau sari direct în integrame.</Text>

      <View style={styles.actions}>
        <Link href="/login" asChild>
          <Button title="Login" onPress={() => {}} />
        </Link>
        <Link href="/signup" asChild>
          <Button title="Creează cont" variant="secondary" onPress={() => {}} />
        </Link>
      </View>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Secțiuni</Text>
        <View style={styles.links}>
          <Link style={styles.link} href="/integrame">Integrame</Link>
          <Link style={styles.link} href="/leaderboard">Leaderboard</Link>
          <Link style={styles.link} href="/profile">Profil</Link>
          <Link style={styles.link} href="/shop">Shop</Link>
          <Link style={styles.link} href="/subscriptions">Abonamente</Link>
          <Link style={styles.link} href="/wallet">Wallet</Link>
          <Link style={styles.link} href="/settings">Setări</Link>
        </View>
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
    fontSize: 26,
    fontWeight: '700',
    marginBottom: spacing.sm
  },
  subtitle: {
    color: colors.muted,
    marginBottom: spacing.lg,
    fontSize: 16
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl
  },
  card: {
    marginTop: spacing.md
  },
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.md
  },
  links: {
    gap: spacing.sm
  },
  link: {
    color: colors.primary,
    fontSize: 16
  }
});
