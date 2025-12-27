import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { colors, SIZES } from '../constants';

interface SettingItemProps {
  label: string;
  description?: string;
  value?: string;
  onPress?: () => void;
  style?: ViewStyle;
  rightContent?: React.ReactNode;
}

export const SettingItem: React.FC<SettingItemProps> = ({
  label,
  description,
  value,
  onPress,
  style,
  rightContent,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>

      <View style={styles.rightContainer}>
        {value && <Text style={styles.value}>{value}</Text>}
        {rightContent && rightContent}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: SIZES.fontLG,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: SIZES.xs,
  },
  description: {
    fontSize: SIZES.fontMD,
    color: colors.textSecondary,
  },
  rightContainer: {
    alignItems: 'flex-end',
  },
  value: {
    fontSize: SIZES.fontMD,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
