'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

type DaisyScoutingAppSettings = {
  season: string;
  eventCode: string;
  getEventId: () => string; // Add the method to the type
};

interface SettingsContextType {
  settings: DaisyScoutingAppSettings;
  // eslint-disable-next-line no-unused-vars
  updateSettings: (newSettings: Partial<DaisyScoutingAppSettings>) => void;
}

const defaultSettings: DaisyScoutingAppSettings = {
  season: getYear(),
  eventCode: '',
  getEventId: function () {
    return `${this.season}${this.eventCode.toUpperCase()}`;
  },
};

const DaisyScoutingAppSettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  updateSettings: function (
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    newSettings: Partial<DaisyScoutingAppSettings>
  ): void {
    throw new Error('Function not implemented.');
  },
});

function getYear() {
  const date = new Date();
  // if the current month is after May, prev season's offseason...
  if (date.getMonth() > 5) {
    return (date.getFullYear() - 1).toString();
  }
  // otherwise we are in active comp season.
  return date.getFullYear().toString();
}

export function DaisyScoutingAppSettingsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      setSettings((prev) => ({
        ...prev,
        ...JSON.parse(savedSettings),
      }));
    }
  }, []);

  const updateSettings = (newSettings: Partial<DaisyScoutingAppSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
    }));
    localStorage.setItem(
      'appSettings',
      JSON.stringify({
        ...settings,
        ...newSettings,
      })
    );
  };

  return (
    <DaisyScoutingAppSettingsContext.Provider
      value={{ settings, updateSettings }}
    >
      {children}
    </DaisyScoutingAppSettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(DaisyScoutingAppSettingsContext);
}
