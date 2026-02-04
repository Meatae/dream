import { useState } from 'react';
import { AppSettings } from '@/types/dream';

const DEFAULT_SETTINGS: AppSettings = {
  voiceEnabled: true
};

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  const saveSettings = async (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
  };

  return {
    settings,
    saveSettings,
    getApiKey: () => process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || ''
  };
}

