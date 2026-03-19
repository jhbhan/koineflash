import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, Switch, TouchableOpacity, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { ScreenWrapper } from '../src/components/ScreenWrapper';
import { Colors } from '../src/constants/colors';
import { loadSettings, saveSettings, clearAllProgress, DEFAULT_SETTINGS } from '../src/utils/storage';
import { AppSettings } from '../src/types';
import { playCorrectSound, unloadSounds } from '../src/utils/sounds';

// Memoized SettingRow to prevent re-renders when other settings change
const SettingRow = React.memo(({ 
  icon, 
  label, 
  value, 
  onValueChange, 
  type = 'switch',
  onPress
}: { 
  icon: keyof typeof Ionicons.glyphMap, 
  label: string, 
  value?: any, 
  onValueChange?: (v: any) => void,
  type?: 'switch' | 'link' | 'text',
  onPress?: () => void
}) => {
  return (
    <TouchableOpacity 
      style={styles.settingRow} 
      activeOpacity={type === 'switch' ? 1 : 0.7}
      onPress={onPress}
      disabled={type === 'switch'}
    >
      <View style={styles.settingLabelContainer}>
        <View style={styles.iconBox}>
          <Ionicons name={icon} size={20} color={Colors.terracotta} />
        </View>
        <Text style={styles.settingLabel}>{label}</Text>
      </View>
      {type === 'switch' ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: Colors.border, true: Colors.terracotta }}
          thumbColor="white"
        />
      ) : type === 'text' ? (
        <Text style={styles.timeValue}>{value}</Text>
      ) : (
        <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
      )}
    </TouchableOpacity>
  );
});

export default function SettingsScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    (async () => {
      const savedSettings = await loadSettings();
      setSettings(savedSettings);
      setIsLoading(false);
    })();

    return () => {
      unloadSounds();
    };
  }, []);

  const triggerHaptic = useCallback((type: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light) => {
    if (settings.hapticFeedback) {
      Haptics.impactAsync(type);
    }
  }, [settings.hapticFeedback]);

  const updateSetting = useCallback(async (key: keyof AppSettings, value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      saveSettings(newSettings);
      return newSettings;
    });

    if (typeof value === 'boolean') {
      if (key === 'hapticFeedback' ? value : settings.hapticFeedback) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      
      if (key === 'soundEnabled' && value) {
        playCorrectSound();
      }
    }
  }, [settings.hapticFeedback]);

  const handleHapticToggle = useCallback((v: boolean) => updateSetting('hapticFeedback', v), [updateSetting]);
  const handleSoundToggle = useCallback((v: boolean) => updateSetting('soundEnabled', v), [updateSetting]);
  const handleHintsToggle = useCallback((v: boolean) => updateSetting('showHints', v), [updateSetting]);
  const handleAutoAdvanceToggle = useCallback((v: boolean) => updateSetting('quizAutoAdvance', v), [updateSetting]);

  const handleResetProgress = useCallback(() => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Reset All Progress',
      'This will permanently delete your session history and card progress.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset Everything', 
          style: 'destructive',
          onPress: async () => {
            await clearAllProgress();
            triggerHaptic(Haptics.ImpactFeedbackStyle.Heavy);
            Alert.alert('Success', 'All progress has been reset.');
          }
        }
      ]
    );
  }, [triggerHaptic]);

  if (isLoading) return <ScreenWrapper><Text>Loading...</Text></ScreenWrapper>;

  return (
    <ScreenWrapper scrollable edges={['left', 'right', 'bottom']}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Practice</Text>
        <View style={styles.card}>
          <SettingRow
            icon="finger-print-outline"
            label="Haptic Feedback"
            value={settings.hapticFeedback}
            onValueChange={handleHapticToggle}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="volume-high-outline"
            label="Sound Effects"
            value={settings.soundEnabled}
            onValueChange={handleSoundToggle}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="help-circle-outline"
            label="Show Hints"
            value={settings.showHints}
            onValueChange={handleHintsToggle}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="play-forward-outline"
            label="Quiz Auto-Advance"
            value={settings.quizAutoAdvance}
            onValueChange={handleAutoAdvanceToggle}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.card}>
           <Text style={styles.noticeText}>
             Daily reminders are currently disabled for Expo Go. Use a development build to enable notifications.
           </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data & Progress</Text>
        <View style={styles.card}>
          <SettingRow
            icon="trash-outline"
            label="Reset All Progress"
            type="link"
            onPress={handleResetProgress}
          />
        </View>
      </View>

      <View style={styles.aboutSection}>
        <Text style={styles.aboutTitle}>Koine Flash</Text>
        <Text style={styles.version}>Version 1.0.0</Text>
        <Text style={styles.credit}>For the Glory of God and the Study of His Word.</Text>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: Colors.cardBg,
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.03)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.ink,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 64,
  },
  timeValue: {
    fontSize: 16,
    color: Colors.terracotta,
    fontWeight: '700',
  },
  noticeText: {
    padding: 16,
    color: Colors.textMuted,
    fontStyle: 'italic',
    fontSize: 14,
    lineHeight: 20,
  },
  aboutSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.ink,
    fontFamily: 'CrimsonPro_700Bold',
  },
  version: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 4,
  },
  credit: {
    fontSize: 12,
    color: Colors.inkLight,
    fontStyle: 'italic',
    marginTop: 12,
    textAlign: 'center',
  },
});
