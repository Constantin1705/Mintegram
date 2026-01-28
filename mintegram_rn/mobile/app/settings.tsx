import React from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { colors, spacing } from '../lib/theme';

export default function SettingsScreen() {
  const [notifications, setNotifications] = React.useState(true);
  const [hints, setHints] = React.useState(false);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Setări</Text>

      <View style={styles.row}>
        <View>
          <Text style={styles.label}>Notificări</Text>
          <Text style={styles.muted}>Primește update-uri despre integrame.</Text>
        </View>
        <Switch value={notifications} onValueChange={setNotifications} />
      </View>

      <View style={styles.row}>
        <View>
          <Text style={styles.label}>Sugestii / hints</Text>
          <Text style={styles.muted}>Activează sugestii contextuale.</Text>
        </View>
        <Switch value={hints} onValueChange={setHints} />
      </View>
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
    marginBottom: spacing.xl
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  label: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700'
  },
  muted: {
    color: colors.muted,
    marginTop: spacing.xs
  }
});
