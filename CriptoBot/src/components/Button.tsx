import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, SIZES } from '../constants';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  const getButtonStyle = () => {
    const baseStyle = {
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: SIZES.radius,
      paddingHorizontal: SIZES.lg,
    };

    let heightStyle = {};
    if (size === 'small') heightStyle = { height: SIZES.buttonHeight - 12 };
    if (size === 'medium') heightStyle = { height: SIZES.buttonHeight };
    if (size === 'large') heightStyle = { height: SIZES.buttonHeight + 8 };

    let colorStyle = {};
    if (variant === 'primary') {
      colorStyle = { backgroundColor: colors.primary };
    } else if (variant === 'secondary') {
      colorStyle = { backgroundColor: colors.secondary };
    } else if (variant === 'success') {
      colorStyle = { backgroundColor: colors.success };
    } else if (variant === 'danger') {
      colorStyle = { backgroundColor: colors.error };
    } else if (variant === 'outline') {
      colorStyle = {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: colors.primary,
      };
    }

    return [
      baseStyle,
      heightStyle,
      colorStyle,
      disabled && { opacity: 0.5 },
    ];
  };

  const getTextStyle = () => {
    const fontSize = size === 'small' ? SIZES.fontMD : SIZES.fontLG;
    const color =
      variant === 'outline' ? colors.primary : colors.textPrimary;

    return {
      fontSize,
      fontWeight: '600' as any,
      color,
    };
  };

  return (
    <TouchableOpacity
      style={[...getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[getTextStyle(), textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
