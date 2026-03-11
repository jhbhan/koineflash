import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Switch, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../src/components/ScreenWrapper';
import { Colors } from '../src/constants/colors';
import { loadSettings, saveSettings, clearAllProgress, DEFAULT_SETTINGS } from '../src/utils/storage';
import { AppSettings } from '../src/types';
import { Button } from '../src/components/Button';

export default function SettingsScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const savedSettings = await loadSettings();
      setSettings(savedSettings);
      setIsLoading(false);
    })();
  }, []);

  const updateSetting = async (key: keyof AppSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await saveSettings(newSettings);
  };

  const handleResetProgress = () => {
    Alert.alert(
      'Reset All Progress',
      'This will permanently delete your session history and card progress. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset Everything', 
          style: 'destructive',
          onPress: async () => {
            await clearAllProgress();
            Alert.alert('Success', 'All progress has been reset.');
          }
        }
      ]
    );
  };

  const SettingRow = ({ 
    icon, 
    label, 
    value, 
    onValueChange, 
    type = 'switch' 
  }: { 
    icon: keyof typeof Ionicons.glyphMap, 
    label: string, 
    value: any, 
    onValueChange: (v: any) => void,
    type?: 'switch' | 'link'
  }) => (
    <View style={styles.settingRow}>
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
      ) : (
        <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
      )}
    </View>
  );

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
            onValueChange={(v) => updateSetting('hapticFeedback', v)}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="volume-high-outline"
            label="Sound Effects"
            value={settings.soundEnabled}
            onValueChange={(v) => updateSetting('soundEnabled', v)}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="help-circle-outline"
            label="Show Hints"
            value={settings.showHints}
            onValueChange={(v) => updateSetting('showHints', v)}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="play-forward-outline"
            label="Quiz Auto-Advance"
            value={settings.quizAutoAdvance}
            onValueChange={(v) => updateSetting('quizAutoAdvance', v)}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.card}>
          <SettingRow
            icon="notifications-outline"
            label="Daily Reminder"
            value={settings.dailyReminder}
            onValueChange={(v) => updateSetting('dailyReminder', v)}
          />
          {settings.dailyReminder && (
             <>
               <View style={styles.divider} />
               <TouchableOpacity style={styles.settingRow}>
                 <View style={styles.settingLabelContainer}>
                   <View style={styles.iconBox}>
                     <Ionicons name="time-outline" size={20} color={Colors.terracotta} />
                   </View>
                   <Text style={styles.settingLabel}>Reminder Time</Text>
                 </View>
                 <Text style={styles.timeValue}>{settings.reminderTime}</Text>
               </TouchableOpacity>
             </>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data & Progress</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.settingRow} onPress={handleResetProgress}>
            <View style={styles.settingLabelContainer}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(255,59,48,0.1)' }]}>
                <Ionicons name="trash-outline" size={20} color={Colors.errorRed} />
              </View>
              <Text style={[styles.settingLabel, { color: Colors.errorRed }]}>Reset All Progress</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.aboutSection}>
        <Text style={styles.aboutTitle}>KoineFlash</Text>
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
