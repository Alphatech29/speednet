import React, { createContext, useContext, useState, useEffect } from 'react';
import { getWebSettings } from '../backendApis/general/general';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [webSettings, setWebSettings] = useState(null);
  const [settingsError, setSettingsError] = useState(null);

  useEffect(() => {
    const fetchWebSettings = async () => {
      try {
        const response = await getWebSettings();

        if (response?.success && response?.data) {
          setWebSettings(response.data);
        } else {
          throw new Error('Invalid settings response');
        }
      } catch (error) {
        console.error('Failed to fetch web settings:', error);
        setSettingsError(error);
      }
    };

    fetchWebSettings();
  }, []);

  return (
    <GlobalContext.Provider value={{ webSettings, setWebSettings, settingsError }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
