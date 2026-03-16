import { useState, useEffect, useCallback } from 'react';
import * as storage from '../utils/storage';
import { AppSettings } from '../types';

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(storage.DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  const loadSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const savedSettings = await storage.loadSettings();
      setSettings(savedSettings);
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const updateSetting = useCallback(async (key: keyof AppSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await storage.saveSettings(newSettings);
  }, [settings]);

  return {
    settings,
    isLoading,
    updateSetting,
    refresh: loadSettings,
  };
}
