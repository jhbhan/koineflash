import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  style,
}) => {
  const buttonStyles: ViewStyle[] = [styles.button];
  const textStyles: TextStyle[] = [styles.text];

  // Variant styles
  if (variant === 'primary') {
    buttonStyles.push(styles.primaryButton);
    textStyles.push(styles.primaryText);
  } else if (variant === 'secondary') {
    buttonStyles.push(styles.secondaryButton);
    textStyles.push(styles.secondaryText);
  } else if (variant === 'ghost') {
    buttonStyles.push(styles.ghostButton);
    textStyles.push(styles.ghostText);
  } else if (variant === 'danger') {
    buttonStyles.push(styles.dangerButton);
    textStyles.push(styles.dangerText);
  }

  // Size styles
  if (size === 'sm') {
    buttonStyles.push(styles.smButton);
    textStyles.push(styles.smText);
  } else if (size === 'lg') {
    buttonStyles.push(styles.lgButton);
    textStyles.push(styles.lgText);
  }

  if (fullWidth) {
    buttonStyles.push(styles.fullWidth);
  }

  if (disabled) {
    buttonStyles.push(styles.disabled);
  }

  if (style) {
    buttonStyles.push(style);
  }

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? 'white' : Colors.ink} />
      ) : (
        <>
          {icon && (
            <Ionicons
              name={icon}
              size={size === 'sm' ? 16 : 20}
              color={textStyles[textStyles.length - 1].color as string}
              style={styles.icon}
            />
          )}
          <Text style={textStyles}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  icon: {
    marginRight: 8,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  // Variants
  primaryButton: {
    backgroundColor: Colors.terracotta,
  },
  primaryText: {
    color: 'white',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.terracotta,
  },
  secondaryText: {
    color: Colors.terracotta,
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: Colors.inkLight,
  },
  dangerButton: {
    backgroundColor: Colors.errorRed,
  },
  dangerText: {
    color: 'white',
  },
  // Sizes
  smButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  smText: {
    fontSize: 14,
  },
  lgButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  lgText: {
    fontSize: 18,
  },
});
