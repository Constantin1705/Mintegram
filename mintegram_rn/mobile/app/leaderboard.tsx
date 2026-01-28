import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Card } from '../components/ui/Card';
import { colors, spacing } from '../lib/theme';

const MOCK_LEADERS = [
  { name: 'Andrei', score: 1240 },
  { name: 'Ioana', score: 1180 },
  { name: 'Maria', score: 990 }
];

export default function LeaderboardScreen() {
  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={{ padding: spacing.xl }}
      data={MOCK_LEADERS}
      keyExtractor={(item) => item.name}
      renderItem={({ item, index }) => (
        <Card style={styles.card}>
          <Text style={styles.name}>{index + 1}. {item.name}</Text>
          <Text style={styles.score}>{item.score} puncte</Text>
        </Card>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    backgroundColor: colors.background
  },
  card: {
    marginBottom: spacing.md
  },
  name: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700'
  },
  score: {
    color: colors.muted,
    marginTop: spacing.xs
  }
});
