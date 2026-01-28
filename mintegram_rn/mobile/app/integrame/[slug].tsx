import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { colors, spacing } from '../../lib/theme';

export default function PuzzleDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Integrame: {slug}</Text>
      <Card>
        <Text style={styles.section}>Descriere</Text>
        <Text style={styles.text}>Aici vom încărca descrierea și grila pentru integrame.</Text>

        <View style={{ height: spacing.lg }} />
        <Button title="Începe jocul" onPress={() => {}} />
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
    fontSize: 22,
    fontWeight: '700',
    marginBottom: spacing.lg
  },
  section: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.sm
  },
  text: {
    color: colors.muted,
    fontSize: 15
  }
});
