import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { Flashcard } from '../types';
import { Colors } from '../constants/colors';
import { Button } from './Button';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.25;

interface FlashCardProps {
  card: Flashcard;
  onCorrect: () => void;
  onIncorrect: () => void;
  showHint?: boolean;
}

export const FlashCard: React.FC<FlashCardProps> = React.memo(({
  card,
  onCorrect,
  onIncorrect,
  showHint: initialShowHint = false,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(initialShowHint);

  const flipRotation = useSharedValue(0);
  const swipeX = useSharedValue(0);
  const swipeOpacity = useSharedValue(1);

  // Reset state when card changes
  useEffect(() => {
    setIsFlipped(false);
    setShowHint(false);
    flipRotation.value = 0;
    swipeX.value = 0;
    swipeOpacity.value = 1;
  }, [card.id]);

  const handleFlip = useCallback(() => {
    if (flipRotation.value === 0) {
      flipRotation.value = withSpring(180);
      setIsFlipped(true);
    } else {
      flipRotation.value = withSpring(0);
      setIsFlipped(false);
    }
  }, []);

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipRotation.value, [0, 180], [0, 180]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      backfaceVisibility: 'hidden',
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipRotation.value, [0, 180], [180, 360]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      backfaceVisibility: 'hidden',
    };
  });

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: swipeX.value }],
      opacity: swipeOpacity.value,
    };
  });

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      swipeX.value = event.translationX;
    })
    .onEnd((event) => {
      if (event.translationX > SWIPE_THRESHOLD) {
        // Swipe Right - Correct
        swipeX.value = withTiming(width, {}, () => {
          runOnJS(onCorrect)();
        });
        swipeOpacity.value = withTiming(0);
      } else if (event.translationX < -SWIPE_THRESHOLD) {
        // Swipe Left - Incorrect
        swipeX.value = withTiming(-width, {}, () => {
          runOnJS(onIncorrect)();
        });
        swipeOpacity.value = withTiming(0);
      } else {
        swipeX.value = withSpring(0);
      }
    });

  return (
    <View style={styles.outerContainer}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.container, containerAnimatedStyle]}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={handleFlip}
            style={styles.cardWrapper}
          >
            {/* Front Side */}
            <Animated.View style={[styles.card, styles.frontCard, frontAnimatedStyle]}>
              <Text style={styles.categoryLabel}>{card.category.replace(/-/g, ' ')}</Text>
              <Text style={styles.promptText}>{card.prompt}</Text>
              
              {!isFlipped && (
                <View style={styles.hintContainer}>
                  {showHint ? (
                    <Text style={styles.hintText}>{card.hint}</Text>
                  ) : (
                    <TouchableOpacity onPress={() => setShowHint(true)}>
                      <Text style={styles.showHintButton}>Show Hint</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
              
              <View style={styles.footer}>
                <Ionicons name="refresh-outline" size={20} color={Colors.textMuted} />
                <Text style={styles.footerText}>Tap to flip</Text>
              </View>
            </Animated.View>

            {/* Back Side */}
            <Animated.View style={[styles.card, styles.backCard, backAnimatedStyle]}>
              <Text style={styles.answerText}>{card.answer}</Text>
              
              <View style={styles.exampleContainer}>
                <Text style={styles.exampleLabel}>Example:</Text>
                <Text style={styles.exampleWord}>{card.exampleWord}</Text>
                <Text style={styles.translation}>"{card.translation}"</Text>
              </View>

              <View style={styles.actionButtons}>
                <Button
                  label="Missed it"
                  onPress={onIncorrect}
                  variant="danger"
                  icon="close-circle-outline"
                  style={styles.actionButton}
                />
                <Button
                  label="Got it"
                  onPress={onCorrect}
                  variant="primary"
                  icon="checkmark-circle-outline"
                  style={styles.actionButton}
                />
              </View>
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>

      <View style={styles.swipeInstructions}>
        <View style={styles.swipeHint}>
          <Ionicons name="arrow-back" size={14} color={Colors.errorRed} />
          <Text style={[styles.swipeHintText, { color: Colors.errorRed }]}>SWIPE LEFT IF MISSED</Text>
        </View>
        
        <View style={styles.swipeDivider} />

        <View style={styles.swipeHint}>
          <Text style={[styles.swipeHintText, { color: Colors.successGreen }]}>SWIPE RIGHT IF CORRECT</Text>
          <Ionicons name="arrow-forward" size={14} color={Colors.successGreen} />
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    height: 420,
    marginVertical: 10,
  },
  container: {
    flex: 1,
  },
  cardWrapper: {
    flex: 1,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: Colors.cardBg,
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    // Shadows
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  frontCard: {
    zIndex: 1,
  },
  backCard: {
    zIndex: 0,
  },
  categoryLabel: {
    position: 'absolute',
    top: 24,
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'CrimsonPro_700Bold',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  promptText: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'CrimsonPro_700Bold',
    textAlign: 'center',
    color: Colors.ink,
    lineHeight: 36,
  },
  hintContainer: {
    marginTop: 30,
    height: 40,
    justifyContent: 'center',
  },
  hintText: {
    fontSize: 16,
    fontFamily: 'CrimsonPro_400Regular',
    color: Colors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  showHintButton: {
    fontSize: 14,
    fontFamily: 'CrimsonPro_600SemiBold',
    color: Colors.terracotta,
    fontWeight: '700',
    textDecorationLine: 'underline',
    padding: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.04)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  footerText: {
    fontSize: 13,
    fontFamily: 'CrimsonPro_600SemiBold',
    color: Colors.inkLight,
    fontWeight: '600',
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  answerText: {
    fontSize: 52,
    fontWeight: 'bold',
    fontFamily: 'CrimsonPro_700Bold',
    color: Colors.terracotta,
    marginBottom: 20,
  },
  exampleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  exampleLabel: {
    fontSize: 12,
    fontFamily: 'CrimsonPro_600SemiBold',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 4,
    letterSpacing: 1,
  },
  exampleWord: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'CrimsonPro_700Bold',
    color: Colors.ink,
  },
  translation: {
    fontSize: 18,
    fontFamily: 'CrimsonPro_400Regular',
    color: Colors.inkLight,
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 'auto',
    paddingBottom: 10,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 6,
  },
  swipeInstructions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  swipeHint: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  swipeHintText: {
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'CrimsonPro_700Bold',
    marginHorizontal: 8,
    letterSpacing: 1,
  },
  swipeDivider: {
    width: 1,
    height: 12,
    backgroundColor: Colors.border,
    marginHorizontal: 15,
  },
});
