import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  interpolateColor,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { Colors } from '../constants/colors';

interface QuizOptionProps {
  label: string;
  onPress: () => void;
  state: 'default' | 'correct' | 'incorrect' | 'disabled';
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export const QuizOption: React.FC<QuizOptionProps> = React.memo(({
  label,
  onPress,
  state,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    let backgroundColor = Colors.cardBg;
    let borderColor = Colors.border;
    let textColor = Colors.ink;

    if (state === 'correct') {
      backgroundColor = Colors.successGreen;
      borderColor = Colors.successGreen;
      textColor = 'white';
    } else if (state === 'incorrect') {
      backgroundColor = Colors.errorRed;
      borderColor = Colors.errorRed;
      textColor = 'white';
    } else if (state === 'disabled') {
      backgroundColor = Colors.parchment;
      borderColor = Colors.parchmentDark;
      textColor = Colors.textMuted;
    }

    return {
      backgroundColor: withTiming(backgroundColor),
      borderColor: withTiming(borderColor),
      transform: [{ scale: scale.value }],
    };
  });

  const handlePress = () => {
    if (state === 'default') {
      scale.value = withSequence(
        withSpring(0.95),
        withSpring(1)
      );
      onPress();
    }
  };

  return (
    <AnimatedTouchableOpacity
      style={[styles.container, animatedStyle]}
      onPress={handlePress}
      disabled={state !== 'default'}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.label,
          state === 'correct' || state === 'incorrect' ? { color: 'white' } : { color: Colors.ink },
          state === 'disabled' && { color: Colors.textMuted }
        ]}
      >
        {label}
      </Text>
    </AnimatedTouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    marginHorizontal: 12, // Added horizontal margin
    alignItems: 'center',
    justifyContent: 'center',
    // Minimalist Shadow
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  label: {
    fontSize: 19,
    fontWeight: '500',
    fontFamily: 'CrimsonPro_600SemiBold',
  },
});
