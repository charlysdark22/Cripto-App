import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ViewStyle,
} from 'react-native';
import { colors, SIZES } from '../constants';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  variant?: 'default' | 'positive' | 'negative' | 'warning';
  style?: ViewStyle;
  icon?: React.ReactNode;
}

export function StatCard({
  label,
  value,
  unit = '',
  variant = 'default',
  style,
  icon,
}: StatCardProps) {
  const getTextColor = () => {
    switch (variant) {
      case 'positive':
        return colors.success;
      case 'negative':
        return colors.error;
      case 'warning':
        return colors.warning;
      default:
        return colors.textPrimary;
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        {icon && <View>{icon}</View>}
      </View>
      
      <View style={styles.valueContainer}>
        <Text style={[styles.value, { color: getTextColor() }]}>
          {value}
        </Text>
        {unit && <Text style={styles.unit}>{unit}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  label: {
    fontSize: SIZES.fontMD,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: SIZES.fontXXL,
    fontWeight: '700',
  },
  unit: {
    fontSize: SIZES.fontMD,
    color: colors.textSecondary,
    marginLeft: SIZES.sm,
  },
});
