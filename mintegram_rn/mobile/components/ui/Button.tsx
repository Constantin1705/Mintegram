import * as React from 'react';
import { ActivityIndicator, Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '../../lib/theme';

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'ghost' | 'secondary';
  style?: ViewStyle;
};

export const Button = ({
  title,
  onPress,
  disabled,
  loading,
  variant = 'primary',
  style
}: Props) => {
  const backgroundColor = variant === 'primary'
    ? colors.primary
    : variant === 'secondary'
      ? colors.accent
      : 'transparent';

  const textColor = variant === 'ghost' ? colors.text : '#0b1220';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }: { pressed: boolean }) => [
        styles.base,
        { backgroundColor, opacity: disabled ? 0.5 : pressed ? 0.85 : 1 },
        style
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.label, { color: textColor }]}>{title}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center'
  },
  label: {
    fontSize: 16,
    fontWeight: '600'
  }
});
