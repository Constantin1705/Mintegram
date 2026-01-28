import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { Card } from '../../components/ui/Card';
import { colors, spacing } from '../../lib/theme';

const MOCK_PUZZLES = [
  { slug: 'daily-1', title: 'Integrame zilnică', difficulty: 'Ușor' },
  { slug: 'logic-2', title: 'Logic 2', difficulty: 'Mediu' },
  { slug: 'expert-3', title: 'Expert', difficulty: 'Greu' }
];

export default function IntegrameScreen() {
  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={{ padding: spacing.xl }}
      data={MOCK_PUZZLES}
      keyExtractor={(item) => item.slug}
      renderItem={({ item }) => (
        <Link href={`/integrame/${item.slug}`} asChild>
          <Card style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.meta}>Dificultate: {item.difficulty}</Text>
            <Text style={styles.link}>Vezi detalii →</Text>
          </Card>
        </Link>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    backgroundColor: colors.background
  },
  card: {
    marginBottom: spacing.lg
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.sm
  },
  meta: {
    color: colors.muted,
    marginBottom: spacing.sm
  },
  link: {
    color: colors.primary,
    fontWeight: '600'
  }
});
