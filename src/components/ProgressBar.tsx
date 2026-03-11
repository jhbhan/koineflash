import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Colors } from '../constants/colors';

interface ProgressBarProps {
  current: number; // 0-based index
  total: number;
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  showLabel = true,
}) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = (current + 1) / total;
  }, [current, total]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.barContainer}>
        <Animated.View style={[styles.progressIndicator, animatedStyle]} />
      </View>
      {showLabel && (
        <Text style={styles.label}>
          {current + 1} of {total}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 10,
    marginTop: 0,
  },
  barContainer: {
    height: 8,
    backgroundColor: Colors.parchmentDark,
    borderRadius: 4,
    overflow: 'hidden',
    width: '100%',
  },
  progressIndicator: {
    height: '100%',
    backgroundColor: Colors.terracotta,
    borderRadius: 4,
  },
  label: {
    marginTop: 4,
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    fontWeight: '500',
  },
});
